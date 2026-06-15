import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const iconDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'app/assets/icons/svg')

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false,
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@element-plus/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/styles/index.scss',
  ],

  app: {
    head: {
      title: 'Timeless · Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8360/admin',
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables.scss" as *;',
        },
      },
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [iconDir],
        symbolId: 'icon-[name]',
      }),
    ],
  },

  devServer: {
    port: 3001,
  },

  elementPlus: {
    importStyle: 'scss',
  },
})
