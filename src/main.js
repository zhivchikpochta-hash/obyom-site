import { OBYOM } from 'obyom';
import './site.css';

const options = {
  canvas: '#viewer',
  params: {},
};

const modelPath = 'assets/3dmodels/stl/OBYOM_LOGO.stl';
const status = document.getElementById('status');
const message = document.getElementById('message');
const configOutput = document.getElementById('viewer-config');

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
  configOutput.textContent = `const viewer = new OBYOM(${JSON.stringify(options, null, 2)});\n\nawait viewer.start();\nawait viewer.load(${JSON.stringify(modelPath)});`;
}

async function start() {
  showConfig();

  if (!navigator.gpu) {
    setStatus('WebGPU unavailable', 'error');
    message.textContent = 'Open this demo in a current browser with WebGPU enabled.';
    return;
  }

  setStatus('Loading OBYOM from GitFlic package', 'loading');
  try {
    const viewer = new OBYOM(options);
    await viewer.start();
    await viewer.load(modelPath);
    setStatus('Viewer ready', 'ready');
    message.remove();
  } catch (error) {
    console.error('Failed to initialize OBYOM viewer', error);
    setStatus('Viewer failed to load', 'error');
    message.textContent = 'The viewer could not be loaded. Check the browser console for details.';
  }
}

void start();
