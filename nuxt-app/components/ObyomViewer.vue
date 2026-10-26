<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  modelPath: string;
  modelLabel?: string;
}>(), { modelLabel: '3D model' });

const canvas = ref<HTMLCanvasElement | null>(null);
const status = ref('Checking WebGPU support…');
const message = ref('Loading viewer…');
let viewer: { start(): Promise<void>; load(path: string): Promise<void>; destroy(): void } | null = null;

onMounted(async () => {
  if (!canvas.value) return;
  if (!('gpu' in navigator)) {
    status.value = 'WebGPU unavailable';
    message.value = 'Use a current browser with WebGPU enabled.';
    return;
  }

  try {
    const { OBYOM } = await import('obyom-3d');
    viewer = new OBYOM({ canvas: canvas.value, params: {} });
    await viewer.start();
    await viewer.load(props.modelPath);
    status.value = 'Ready';
    message.value = '';
  } catch (error) {
    console.error('Failed to initialize OBYOM viewer', error);
    status.value = 'Viewer unavailable';
    message.value = 'The model could not be initialized in this browser.';
  }
});

onBeforeUnmount(() => {
  viewer?.destroy();
  viewer = null;
});
</script>

<template>
  <div class="viewer-card">
    <div class="viewer-heading">
      <p class="eyebrow">Interactive preview</p>
      <p class="status" role="status" aria-live="polite">{{ status }}</p>
    </div>
    <div class="canvas-frame">
      <canvas ref="canvas" :aria-label="`${props.modelLabel} interactive 3D preview`" />
      <p v-if="message" class="message">{{ message }}</p>
    </div>
    <p class="hint">↔ Drag to rotate the model. Touch gestures are supported.</p>
  </div>
</template>
