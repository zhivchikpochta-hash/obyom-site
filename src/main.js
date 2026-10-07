import { OBYOM } from 'obyom-3d';
import './site.css';

const canvas = document.querySelector('[data-obyom-viewer]');
const options = {
  canvas: canvas || '#viewer',
  params: {},
};

let modelPath = new URL(canvas?.dataset.modelPath || 'assets/3dmodels/stl/EDF+Rotor.stl', document.baseURI).href;
let modelLabel = canvas?.dataset.modelLabel || 'EDF+Rotor.stl';
const modelName = document.getElementById('model-name');
const status = document.getElementById('status');
const message = document.getElementById('message');
const configOutput = document.getElementById('viewer-config');
const translate = (key) => window.OBYOM_I18N?.t(`main.${key}`) || key;

function scheduleReadyPulse(dot) {
  const delay = 1000 + Math.random() * 2000;
  window.setTimeout(() => {
    if (!dot.isConnected || !dot.classList.contains('status-dot--ready')) return;
    dot.classList.remove('status-dot--pulse');
    void dot.offsetWidth;
    dot.classList.add('status-dot--pulse');
    window.setTimeout(() => {
      dot.classList.remove('status-dot--pulse');
      scheduleReadyPulse(dot);
    }, 500);
  }, delay);
}

function setStatus(text, state) {
  if (!status) return;
  status.textContent = '';
  const dot = document.createElement('span');
  dot.className = `status-dot status-dot--${state}`;
  dot.setAttribute('aria-hidden', 'true');
  status.append(dot, document.createTextNode(text));
  if (state === 'ready') scheduleReadyPulse(dot);
}

function showConfig() {
  if (modelName) modelName.textContent = modelLabel;
  if (!configOutput) return;
  configOutput.textContent = `const viewer = new OBYOM(${JSON.stringify(options, null, 2)});\n\nawait viewer.start();\nawait viewer.load(${JSON.stringify(modelPath)});`;
}

let viewer = null;

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => window.setTimeout(() => reject(new Error(`${label} timed out after 15 seconds`)), 15000)),
  ]);
}

async function start() {
  if (!canvas) return;
  viewer?.destroy();
  viewer = null;
  showConfig();

  if (!navigator.gpu) {
    setStatus(translate('unavailable'), 'error');
    if (message) message.textContent = translate('unavailableMessage');
    return;
  }

  setStatus(translate('loadingPackage'), 'loading');
  try {
    viewer = new OBYOM(options);
    await withTimeout(viewer.start(), 'WebGPU initialization');
    await withTimeout(viewer.load(modelPath), 'Model loading');
    setStatus(translate('ready'), 'ready');
    message?.remove();
  } catch (error) {
    console.error('Failed to initialize OBYOM viewer', error);
    setStatus(translate('failed'), 'error');
    if (message) message.textContent = translate('failedMessage');
  }
}

async function loadModel(path, label) {
  modelPath = new URL(path, document.baseURI).href;
  modelLabel = label;
  viewer?.destroy();
  viewer = null;
  showConfig();
  if (message) message.textContent = translate('loading');
  await start();
}

document.querySelectorAll('[data-model-path]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-model-path]').forEach((item) => item.removeAttribute('aria-current'));
    button.setAttribute('aria-current', 'true');
    void loadModel(button.dataset.modelPath, button.dataset.modelLabel || button.textContent.trim());
  });
});

void start();
