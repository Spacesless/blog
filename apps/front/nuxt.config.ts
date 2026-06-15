// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: [
    "@nuxt/eslint",
    "@unocss/nuxt",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@element-plus/nuxt",
    "@pinia/nuxt",
  ],
  css: [
    "@unocss/reset/tailwind.css",
    "~/assets/css/main.css",
    "~/assets/css/prism.css",
  ],
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        (process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8360/front"
          : "https://www.timelessq.com/front"),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  },
  app: {
    head: {
      title: "Timeless · 时光",
      meta: [
        {
          name: "description",
          content:
            "Timeless — 消逝的，亦是永恒的。读万卷书、行万里路、做万般事。",
        },
        { name: "viewport", content: "width=device-width,initial-scale=1" },
      ],
      htmlAttrs: { lang: "zh-CN" },
    },
  },
});
