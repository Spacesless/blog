import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: "https://esm.sh/",
    }),
    presetTypography(),
    presetWebFonts({
      provider: "google",
      fonts: {
        display: "Cormorant Garamond:400,500,600",
        serif: "Noto Serif SC:300,400,500,600",
        sans: "Inter:300,400,500",
        mono: "JetBrains Mono:300,400,500",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      ink: {
        50: "#f5f3ee",
        100: "#e8e4d8",
        200: "#c9c2b0",
        300: "#9a9282",
        400: "#5a5648",
        500: "#2d2b24",
        600: "#1a1814",
        700: "#12110d",
        800: "#0b0a07",
        900: "#050403",
      },
      gold: {
        300: "#e6c98b",
        400: "#d4a85a",
        500: "#b8893a",
      },
      cyan: {
        300: "#7dd3d8",
        400: "#3aa9af",
        500: "#1d7e84",
      },
      crimson: "#a8443f",
      moss: "#5a7050",
    },
    fontFamily: {
      display: "'Cormorant Garamond', serif",
      serif: "'Noto Serif SC', serif",
      mono: "'JetBrains Mono', monospace",
    },
    animation: {
      keyframes: {
        "fall-slow":
          "{0%{transform:translateY(-10vh) translateX(0) rotate(0deg);opacity:0}10%{opacity:.8}90%{opacity:.8}100%{transform:translateY(110vh) translateX(var(--drift,40px)) rotate(360deg);opacity:0}}",
        "fade-up":
          "{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}",
        "ink-spread":
          "{0%{opacity:0;transform:scale(.6)}100%{opacity:.18;transform:scale(1)}}",
        "scan-line":
          "{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}",
        "celestial-arc":
          "{0%{transform:rotate(-90deg)}100%{transform:rotate(90deg)}}",
        glow: "{0%,100%{opacity:.4}50%{opacity:1}}",
        "data-flicker": "{0%,100%{opacity:.3}50%{opacity:.9}}",
      },
      durations: {
        "fall-slow": "12s",
        "fade-up": "1s",
        "ink-spread": "2s",
        "scan-line": "8s",
        "celestial-arc": "60s",
        glow: "3s",
        "data-flicker": "2s",
      },
      counts: {
        "fall-slow": "infinite",
        "scan-line": "infinite",
        glow: "infinite",
        "data-flicker": "infinite",
      },
      timingFns: {
        "fall-slow": "linear",
        "fade-up": "cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  shortcuts: {
    "panel-title":
      "font-display text-5xl md:text-7xl lg:text-8xl tracking-wide leading-tight",
    "panel-sub":
      "font-serif text-base md:text-lg tracking-[.3em] text-ink-200/70",
    "tech-tag":
      "font-mono text-xs uppercase tracking-[.4em] text-cyan-300/60",
    "ink-card":
      "border border-ink-200/10 backdrop-blur-sm bg-ink-700/40 hover:bg-ink-600/40 transition-all duration-700",
  },
  safelist: [
    "i-ph-feather",
    "i-ph-mountains",
    "i-ph-toolbox",
    "i-ph-database",
    "i-ph-book-open-text",
    "i-ph-arrow-right",
    "i-ph-sun",
    "i-ph-moon-stars",
    "i-ph-leaf",
    "i-ph-list",
    "i-ph-x",
    "i-ph-github-logo",
    "i-ph-envelope-simple",
    "i-ph-rss-simple",
    "i-ph-compass",
    "i-ph-gear-six",
    "i-ph-ruler",
    "i-ph-wrench",
    "i-ph-hammer",
    "i-ph-screwdriver",
    "i-ph-pen-nib",
    "i-ph-scissors",
  ],
});
