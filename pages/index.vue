<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useHead } from '#imports';

const processCards = [
  { title: 'The workshop creates a link', description: 'Order details and the model stay connected in one shareable link.' },
  { title: 'The client uploads the STL', description: 'The model appears directly in the browser without CAD software.' },
  { title: 'The client confirms the model', description: 'Both sides know exactly which version is ready for production.' },
  { title: 'The workshop sees the status', description: 'The confirmed version remains visible for the next step in the workflow.' },
];

useHead({ title: 'OBYOM — WebGPU 3D Viewer for the Browser', meta: [{ name: 'description', content: 'OBYOM is a WebGPU 3D viewer and JavaScript library for interactive STL and 3D model previews directly in the browser.' }] });

let cleanupProcessDeck: (() => void) | undefined;
onMounted(() => {
  const processCards = [...document.querySelectorAll<HTMLElement>('.process-card')];
  const shells = processCards.map((card) => card.closest<HTMLElement>('.process-card-shell'));
  const desktop = window.matchMedia('(min-width: 1200px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pinStart = 51;
  const stackStep = 56;
  const depthScale = 0.016;
  let frame = 0;
  let sources: number[] = [];
  let widths: number[] = [];
  let lefts: number[] = [];
  let nextSectionTop = 0;
  let deckBottom = 0;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const measure = () => {
    sources = shells.map((shell) => shell ? shell.getBoundingClientRect().top + scrollY : 0);
    widths = processCards.map((card) => card.getBoundingClientRect().width);
    lefts = processCards.map((card) => card.getBoundingClientRect().left);
    const next = document.querySelector<HTMLElement>('.feature-grid');
    nextSectionTop = next ? next.getBoundingClientRect().top + scrollY : 0;
    const height = Math.max(310, ...processCards.map((card) => card.getBoundingClientRect().height));
    deckBottom = pinStart + stackStep * Math.max(processCards.length - 1, 0) + height;
  };
  const reset = () => processCards.forEach((card) => ['transform', 'opacity', 'box-shadow', 'z-index', 'position', 'top', 'left', 'width'].forEach((property) => card.style.removeProperty(property)));
  const update = () => {
    frame = 0;
    if (!desktop.matches || reduced.matches || !processCards.length || nextSectionTop - scrollY <= deckBottom) { reset(); return; }
    const distance = innerHeight * 0.42;
    const states = processCards.map((_, index) => clamp((scrollY - ((sources[index] || 0) - pinStart - distance)) / distance));
    const enteringIndex = states.findIndex((progress) => progress < 1 && progress > 0);
    const frontIndex = enteringIndex >= 0 ? Math.max(0, enteringIndex - 1) : states.reduce((last, progress, index) => progress >= 1 ? index : last, -1);
    processCards.forEach((card, index) => {
      const progress = states[index] ?? 0;
      const entering = index === enteringIndex;
      const inDeck = progress >= 1 || (entering && progress > 0);
      const depth = index < frontIndex ? frontIndex - index : 0;
      const offset = (sources[index] || 0) - scrollY - pinStart;
      if (inDeck) {
        card.style.position = 'fixed'; card.style.top = `${pinStart + stackStep * depth}px`; card.style.left = `${lefts[index]}px`; card.style.width = `${widths[index]}px`; card.style.zIndex = String(entering ? 30 : 10 + index);
      } else { card.style.removeProperty('position'); card.style.removeProperty('top'); card.style.removeProperty('left'); card.style.removeProperty('width'); card.style.zIndex = '1'; }
      card.style.transform = `translate3d(0, ${(entering ? offset * (1 - progress) : 0).toFixed(2)}px, 0) scale(${(1 - depthScale * depth).toFixed(4)})`;
      card.style.opacity = (entering ? Math.max(0.86, progress) : 1 - Math.min(0.045, depth * 0.015)).toFixed(3);
      card.style.boxShadow = `0 ${Math.round(16 - 2 * depth)}px ${Math.round(46 - 4 * depth)}px rgba(0,0,0,${(0.14 + 0.02 * depth).toFixed(3)})`;
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const resize = () => { reset(); measure(); schedule(); };
  addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', resize, { passive: true });
  desktop.addEventListener?.('change', resize); reduced.addEventListener?.('change', schedule);
  measure(); schedule();
  cleanupProcessDeck = () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', resize); desktop.removeEventListener?.('change', resize); reduced.removeEventListener?.('change', schedule); reset(); };
});
onBeforeUnmount(() => cleanupProcessDeck?.());
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
  <section id="how" class="process-section" aria-labelledby="process-title">
    <div class="section-intro">
      <p class="eyebrow">One clear process</p>
      <h2 id="process-title">From link to confirmed version.</h2>
      <p>The workshop creates a link, the client reviews one model, and both sides stay aligned on the exact file.</p>
    </div>
    <div class="process-cards">
      <article v-for="(card, index) in processCards" :key="card.title" class="process-card-shell">
        <div class="process-card">
          <div class="process-card-copy">
            <span class="process-card-index">Step {{ index + 1 }}</span>
            <strong>{{ card.title }}</strong>
            <p>{{ card.description }}</p>
          </div>
          <div class="process-graphic" aria-hidden="true"><span>{{ String(index + 1).padStart(2, '0') }}</span></div>
        </div>
      </article>
    </div>
  </section>
  <section class="feature-grid">
    <div class="feature"><strong>Runs in the browser</strong><span>No installation or CAD application required.</span></div>
    <div class="feature"><strong>Powered by WebGPU</strong><span>Modern GPU rendering for interactive previews.</span></div>
    <div class="feature"><strong>Simple to embed</strong><span>A small viewer core built for the web.</span></div>
  </section>
</template>
