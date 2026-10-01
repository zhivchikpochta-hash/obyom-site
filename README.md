# OBYOM Site

A focused landing page and live demo for [OBYOM](https://gitflic.ru/project/3axap777/obyom) — a lightweight WebGPU viewer for interactive 3D model previews in the browser.

The site is both a product presentation and a real consumer of the OBYOM package. The viewer imports `OBYOM` from the GitFlic dependency, starts a WebGPU renderer, and loads the demo STL model from the site-owned assets.

## Live demo

Open the deployed site and rotate the model directly in the browser:

- **Demo:** [OBYOM WebGPU viewer](https://zhivchikpochta-hash.github.io/obyom-site/)
- **Get Started:** [installation and integration guide](https://zhivchikpochta-hash.github.io/obyom-site/get-started.html)
- **Library source:** [GitFlic](https://gitflic.ru/project/3axap777/obyom)

WebGPU availability depends on the browser, operating system, GPU, drivers, and browser settings.

## What the demo shows

- WebGPU-based 3D rendering in a responsive canvas
- STL model loading through the public OBYOM API
- Mouse and touch rotation
- Two-finger pinch zoom and pan
- Wheel zoom on desktop
- Mobile gesture handling without scrolling the page while interacting with the model
- Responsive layout for desktop and mobile screens
- Explicit WebGPU loading and error states
- Cache-busted generated runtime files tied to the resolved OBYOM revision

## Local development

Requirements:

- Node.js **20.9+**
- npm **10+**
- A browser with WebGPU enabled

Install dependencies and build the site:

```bash
npm install
npm run build
```

The build writes the generated runtime to the repository root. Serve the directory through HTTP rather than opening `index.html` directly:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080> in a WebGPU-capable browser.

## Viewer integration

The site uses the public OBYOM flow:

```js
import { OBYOM } from 'obyom-3d';

const viewer = new OBYOM({
  canvas: '#viewer',
  params: {},
});

await viewer.start();
await viewer.load('assets/3dmodels/stl/EDF+Rotor.stl');
```

The demo keeps the viewer instance in the site controller and calls `destroy()` before a new initialization. This prevents duplicate render loops and accumulated input listeners during reinitialization.

## Interaction

- **Desktop:** drag to rotate, `Shift` + drag to pan, wheel to zoom
- **Touch:** one-finger drag to rotate, two fingers to zoom and pan
- **Mobile:** the viewer canvas uses `touch-action: none`, so model gestures do not become page scrolling

## Project structure

```text
.
├── index.html                         Landing page and viewer markup
├── get-started.html                   Installation and integration guide
├── styles.css                         Site layout, theme, and responsive styles
├── src/main.js                        OBYOM integration and demo controller
├── webpack.config.js                  Site build configuration
├── assets/3dmodels/stl/EDF+Rotor.stl  Site-owned demo model
├── assets/                            Logo and favicon assets
├── site-<revision>.js                 Generated site runtime
└── shaders/webgpu/                    Generated OBYOM shader assets
```

## Development

The site build imports the package declared in `package.json`:

```text
git+https://gitflic.ru/project/3axap777/obyom.git#master
```

For a fresh dependency revision, remove the disposable install state and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

The generated bundle and shader filenames are versioned with the resolved OBYOM commit so that deployed browsers do not reuse an older runtime from cache.

## Browser support

Use a current browser with WebGPU enabled. The demo currently documents these minimum versions:

- Chrome 113+
- Edge 113+
- Safari 26+
- Firefox 141+

Actual support also depends on the platform, GPU, drivers, and browser configuration. See [Can I Use — WebGPU](https://caniuse.com/webgpu) for current compatibility details.

## Troubleshooting

### WebGPU is unavailable

Check that:

1. The browser supports WebGPU.
2. WebGPU is enabled for the browser and platform.
3. The GPU driver is current.
4. The page is served over HTTP(S), not opened as a local `file://` document.

### The model does not load

Check the browser console and verify that the following paths are served from the same site root:

- the generated `site-<revision>.js` bundle;
- the matching files in `shaders/webgpu/`;
- `assets/3dmodels/stl/EDF+Rotor.stl`.

## License

See the [OBYOM library repository](https://gitflic.ru/project/3axap777/obyom) for the project license and source.
