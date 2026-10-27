<script setup lang="ts">
import { ref } from 'vue';
import { useHead } from '#imports';

useHead({ title: 'Interactive WebGPU 3D Viewer Demo | OBYOM' });
const model = ref('/assets/3dmodels/stl/OBYOM_LOGO-47173defdc07.stl');
const label = ref('OBYOM Logo');
const models = [
  { path: '/assets/3dmodels/stl/OBYOM_LOGO-47173defdc07.stl', label: 'OBYOM Logo' },
  { path: '/assets/3dmodels/stl/EDF+Rotor.stl', label: 'EDF Rotor' },
];
</script>

<template>
  <section class="docs-hero"><p class="eyebrow">Interactive models</p><h1>See how your model can work in the browser.</h1><p class="docs-lead">Choose a model, rotate it, and explore the same kind of browser-based preview you can share with a client.</p></section>
  <div class="model-picker"><button v-for="item in models" :key="item.path" class="model-choice" :aria-current="model === item.path" @click="model = item.path; label = item.label">{{ item.label }}</button></div>
  <ObyomViewer :key="model" :model-path="model" :model-label="label" />
  <section class="feature-grid"><div class="feature"><strong>Rotate</strong><span>Inspect the form from any angle.</span></div><div class="feature"><strong>Share</strong><span>Give a client a link instead of a screenshot.</span></div><div class="feature"><strong>Approve</strong><span>Tie feedback to one exact model version.</span></div></section>
</template>
