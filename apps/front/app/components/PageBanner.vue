<template>
  <div
    class="page-banner relative mb-[var(--grid-space)] flex flex-col items-center justify-center overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)] bg-cover bg-center"
    :style="{
      backgroundImage: `url(${props.backgroundImage})`,
      aspectRatio: `1280 / ${props.baseHeight}`,
    }"
  >
    <!-- 渐变遮罩层 -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-pink-600/20"
    />
    <div class="absolute inset-0 bg-black/35" />

    <!-- 装饰性光晕 -->
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
    />
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
    />

    <!-- 内容区 -->
    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <h1
        class="page-banner__title py-3 text-6xl font-extrabold tracking-tight lt-md:text-4xl lt-sm:text-3xl"
      >
        {{ props.title }}
      </h1>
      <div
        v-if="props.subtitle || $slots.subtitle"
        class="page-banner__subtitle mt-4 text-xl font-medium text-white/95 leading-relaxed lt-md:text-lg lt-sm:text-base [&_span]:text-white/95"
      >
        <slot name="subtitle">{{ props.subtitle }}</slot>
      </div>
      <p
        v-if="props.extra"
        class="page-banner__extra mt-3 text-base text-white/85 leading-relaxed lt-md:text-sm"
      >
        {{ props.extra }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    extra?: string;
    backgroundImage?: string;
    baseHeight?: number;
  }>(),
  {
    backgroundImage: "/background.png",
    baseHeight: 500,
    subtitle: '',
    extra: ''
  },
);
</script>

<style scoped>
.page-banner__title {
  background: linear-gradient(
    120deg,
    #a8edea 0%,
    #6dd5fa 25%,
    #2980f5 50%,
    #a770ef 75%,
    #fd9ed6 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.35));
  animation:
    banner-gradient 6s ease infinite,
    banner-fade-up 0.8s ease-out;
}

.page-banner__subtitle,
.page-banner__extra {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
  animation: banner-fade-up 0.8s ease-out 0.15s both;
}

.page-banner__extra {
  animation-delay: 0.3s;
}

@keyframes banner-gradient {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}

@keyframes banner-fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-banner__title,
  .page-banner__subtitle,
  .page-banner__extra {
    animation: none;
  }
}
</style>
