import './styles.css';
import { OBYOM } from './obyom';

const code = `const obyom = new OBYOM({\n  canvas: '#viewer',\n  params: {}\n});\n\nawait obyom.start();\nawait obyom.load('model.stl');`;

const status = document.querySelector<HTMLElement>('#demo-status');
const message = document.querySelector<HTMLElement>('#demo-message');
const copyButton = document.querySelector<HTMLButtonElement>('#copy-code');

async function startDemo(): Promise<void> {
  if (!('gpu' in navigator)) throw new Error('WebGPU is not available in this browser.');
  const viewer = new OBYOM({ canvas: '#viewer', params: {} });
  await viewer.start();
  await viewer.load('/assets/OBYOM_LOGO.stl');
  status?.replaceChildren('Renderer ready');
  message?.remove();
}

copyButton?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(code);
  copyButton.textContent = 'Copied';
  window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 1600);
});

void startDemo().catch((error: unknown) => {
  const text = error instanceof Error ? error.message : 'The demo could not be initialized.';
  if (status) status.textContent = 'WebGPU unavailable';
  if (message) message.textContent = text;
  console.error('OBYOM demo initialization failed', error);
});
