import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/main.css'],
  nitro: {},
  typescript: {
    strict: true,
    typeCheck: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'OBYOM',
      meta: [
        { name: 'description', content: 'OBYOM — browser-based 3D model previews for workshops and clients.' },
      ],
    },
  },
});
