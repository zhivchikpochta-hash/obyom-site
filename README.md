# OBYOM Site

A focused landing page and live demo for [OBYOM](https://gitflic.ru/project/3axap777/obyom) — a lightweight WebGPU viewer for interactive 3D model previews in the browser.

The site is both a product presentation and a real consumer of the OBYOM package. The viewer imports `OBYOM` from the GitFlic dependency, starts a WebGPU renderer, and loads the demo STL model from the site-owned assets.

Visible site content is available in English and Russian. The browser locale is detected automatically: `ru` locales receive Russian copy, while every other locale receives English copy.

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

- Node.js **22.23.4+**
- npm **10+**
- A browser with WebGPU enabled

Install dependencies and generate the static Nuxt site:

```bash
npm install
npm run generate
```

The static build is written to `.output/public`. Serve that directory through HTTP rather than opening an HTML file directly:

```bash
python3 -m http.server 8080 --directory .output/public
```

Then open <http://localhost:8080> in a WebGPU-capable browser. For an interactive development server with hot reload, use `npm run dev` instead.

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

## Russian pilot landing page

The workshop pilot landing page is available at [`landing.html`](landing.html). It describes the actual product flow: a workshop creates a link, a client uploads an STL, both sides preview the model in the browser, and the workshop confirms the exact version before downloading it.

## Project structure

```text
.
├── app.vue                            Nuxt application shell
├── assets/main.css                    Nuxt entry styles
├── components/ObyomViewer.vue         Client-only OBYOM WebGPU viewer
├── layouts/default.vue                Shared header, navigation, and footer
├── pages/index.vue                    Product landing page
├── pages/demo.vue                     Interactive model demo
├── pages/get-started.vue              Developer installation guide
├── pages/for-clients.vue              Workshop/client workflow
├── public/assets/3dmodels/stl/        Site-owned STL model assets
├── public/obyom-logo.svg              Public logo asset
├── nuxt.config.ts                     Nuxt and static-generation configuration
├── package.json                       Nuxt and obyom-3d dependencies
├── package-lock.json                  Locked dependency tree
└── .output/public/                    Generated static site for deployment
```

## Development

The Nuxt application imports the exact OBYOM revision declared in `package.json`. Keep `package-lock.json` in sync when updating dependencies:

```bash
npm install
npm run typecheck
npm run generate
```

The generated static site is written to `.output/public` for deployment to GitHub Pages or another static host.

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
