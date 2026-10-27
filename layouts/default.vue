<script setup lang="ts">
const route = useRoute();
const path = computed(() => route.path);
const isDemo = computed(() => path.value === '/demo');
const isDevelopers = computed(() => path.value === '/get-started');
const isWorkshops = computed(() => path.value === '/for-clients');

const nav = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Demo' },
  { href: '/get-started', label: 'For developers' },
  { href: '/for-clients', label: 'For workshops' },
];
</script>

<template>
  <div class="site-shell">
    <header class="header">
      <NuxtLink class="brand" to="/" aria-label="OBYOM home">
        <img src="/obyom-logo.svg" alt="">
        <strong>OBYOM</strong>
      </NuxtLink>
      <nav class="nav" aria-label="Primary navigation">
        <NuxtLink v-for="item in nav" :key="item.href" :class="{ 'nav-active': path === item.href }" :to="item.href">{{ item.label }}</NuxtLink>
        <a href="https://gitflic.ru/project/3axap777/obyom" target="_blank" rel="noreferrer">Source code ↗</a>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <div><a href="mailto:3axap777@vk.com">Contact by email</a><a href="https://t.me/iopa3axap777" target="_blank" rel="noreferrer">Telegram</a></div>
      <div><span>Developed by <a href="https://gitflic.ru/user/3axap777" target="_blank" rel="noreferrer">3axap777</a></span><span>© 2026</span></div>
    </footer>
  </div>
</template>
