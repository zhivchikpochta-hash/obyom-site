<script setup lang="ts">
useHead({ title: 'OBYOM — WebGPU 3D Viewer for the Browser', meta: [{ name: 'description', content: 'OBYOM is a WebGPU 3D viewer and JavaScript library for interactive STL and 3D model previews directly in the browser.' }] });
</script>

<template>
  <section class="manifesto">
    <p class="manifesto-intro">Add <strong>OBYOM</strong> in your</p>
    <ul class="manifesto-list">
      <li><strong>Site</strong><span>A living entry point for your work.</span></li>
      <li><strong>Project</strong><span>A model, a version, a shared direction.</span></li>
      <li><strong>Solution</strong><span>The whole workflow, brought into focus.</span></li>
    </ul>
  </section>
  <section class="hero">
    <p class="eyebrow">WebGPU 3D viewer</p>
    <h1>Show your 3D work to clients directly in the browser.</h1>
    <p class="hero-copy">Create interactive previews for your portfolio or send a specific model for client approval — without asking anyone to install CAD software.</p>
    <NuxtLink class="button button-primary" to="/demo">Try the demo ↓</NuxtLink>
  </section>
  <ObyomViewer model-path="/assets/3dmodels/stl/pumpkin_face.stl" model-label="pumpkin_face.stl" />
  <section class="feature-grid">
    <div class="feature"><strong>Runs in the browser</strong><span>No installation or CAD application required.</span></div>
    <div class="feature"><strong>Powered by WebGPU</strong><span>Modern GPU rendering for interactive previews.</span></div>
    <div class="feature"><strong>Simple to embed</strong><span>A small viewer core built for the web.</span></div>
  </section>
</template>
