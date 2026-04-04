export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/cyber.css'],
  app: {
    head: {
      title: '时间胶囊-Nuxt',
      meta: [
        { name: 'description', content: '时间胶囊应用的 Nuxt 全栈实现' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  nitro: {
    experimental: {
      tasks: false,
    },
  },
  routeRules: {
    '/api/**': {
      cors: true,
    },
  },
})
