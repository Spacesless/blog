export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  ssr: false,
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    "@element-plus/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
  ],

  css: ["@unocss/reset/tailwind.css", "~/assets/styles/index.scss"],

  app: {
    baseURL: "/cms/",
    head: {
      title: "Timeless · Admin",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  runtimeConfig: {
    public: {
      // 开发/生产均走相对路径 /admin，开发时由 Vite 代理转发，生产时由 Nginx 转发
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/admin",
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
    server: {
      proxy: {
        "/admin": {
          target: "http://127.0.0.1:8360",
          changeOrigin: true,
        },
      },
    },
  },

  devServer: {
    port: 3001,
  },

  elementPlus: {
    importStyle: "scss",
  },
});
