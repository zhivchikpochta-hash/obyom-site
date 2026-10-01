import { OBYOM } from 'obyom-3d';
import './site.css';

const options = {
  canvas: '#viewer',
  params: {},
};

const modelPath = 'assets/3dmodels/stl/EDF+Rotor.stl';
const modelLabel = 'EDF+Rotor.stl';
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
  status.textContent = '';
  const dot = document.createElement('span');
  dot.className = `status-dot status-dot--${state}`;
  dot.setAttribute('aria-hidden', 'true');
  status.append(dot, document.createTextNode(text));
  if (state === 'ready') scheduleReadyPulse(dot);
}

function showConfig() {
  modelName.textContent = modelLabel;
  configOutput.textContent = `const viewer = new OBYOM(${JSON.stringify(options, null, 2)});\n\nawait viewer.start();\nawait viewer.load(${JSON.stringify(modelPath)});`;
}

let viewer = null;

async function start() {
  viewer?.destroy();
  viewer = null;
  showConfig();

  if (!navigator.gpu) {
    setStatus(translate('unavailable'), 'error');
    message.textContent = translate('unavailableMessage');
    return;
  }

  setStatus(translate('loadingPackage'), 'loading');
  try {
    viewer = new OBYOM(options);
    await viewer.start();
    await viewer.load(modelPath);
    setStatus(translate('ready'), 'ready');
    message.remove();
  } catch (error) {
    console.error('Failed to initialize OBYOM viewer', error);
    setStatus(translate('failed'), 'error');
    message.textContent = translate('failedMessage');
  }
}

void start();
