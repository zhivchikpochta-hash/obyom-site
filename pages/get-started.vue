<script setup lang="ts">
import { useHead } from '#imports';

useHead({ title: 'WebGPU 3D Viewer JavaScript Library — Get Started | OBYOM' });
</script>

<template>
  <section class="docs-hero"><p class="eyebrow">Documentation</p><h1>Get OBYOM running in your project.</h1><p class="docs-lead">Install the package, mount a canvas, and load your first 3D model with a small async setup.</p></section>
  <article class="guide">
    <section class="guide-section"><p class="step-label">Requirements</p><h2>Start with a WebGPU-ready browser.</h2><p>OBYOM runs in the browser and needs WebGPU access. Use a current Chrome, Edge, Safari, or Firefox release with WebGPU enabled.</p></section>
    <section class="guide-section"><p class="step-label">Install</p><h2>Add the package to your application.</h2><pre class="code-block"><code>npm install obyom-3d</code></pre></section>
    <section class="guide-section"><p class="step-label">Initialize</p><h2>Mount a viewer on a canvas.</h2><pre class="code-block"><code>import { OBYOM } from 'obyom-3d';

const obyom = new OBYOM({ canvas: '#viewer', params: {} });
await obyom.start();
await obyom.load('/assets/model.stl');</code></pre></section>
    <section class="guide-section"><p class="step-label">Deploy</p><h2>Serve the built application over HTTP(S).</h2><p>Keep the bundle, model files, and static assets available at their referenced paths.</p><NuxtLink class="button button-primary" to="/demo">Try the viewer ↗</NuxtLink></section>
  </article>
</template>
