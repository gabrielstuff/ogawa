// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
  ],

  devtools: { enabled: true },

  fonts: {
    families: [{ name: 'Inter', provider: 'google' }],
  },

  devServer: {
    port: 3000,
  },

  app: {
    head: {
      title: 'Ogawa - Torrent Client',
      meta: [
        { name: 'description', content: 'Modern torrent web client' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
        { name: 'theme-color', content: '#0f172a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  ui: {},

  runtimeConfig: {
    // Server-side only
    qbittorrentUrl: process.env.QBITTORRENT_URL || 'http://localhost:8080',
    qbittorrentUsername: process.env.QBITTORRENT_USERNAME || 'admin',
    qbittorrentPassword: process.env.QBITTORRENT_PASSWORD || 'adminadmin',

    // Turso database
    tursoUrl: process.env.TURSO_URL || 'file:ogawa.db',
    tursoToken: process.env.TURSO_TOKEN,

    // Public (client-side)
    public: {
      appName: 'Ogawa',
      appVersion: '1.0.0',
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    payloadExtraction: false,
  },
  compatibilityDate: '2024-11-01',

  nitro: {
    preset: 'node-server',
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Ogawa - Torrent Client',
      short_name: 'Ogawa',
      description: 'Modern torrent web client',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
})
