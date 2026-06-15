<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
    <div class="text-7xl font-display text-ink-200/30">404</div>
    <h2 class="mt-4 text-xl font-serif">该工具页暂不可用</h2>
    <p class="mt-2 text-sm text-[var(--color-secondary,#888)]">
      旧版工具页已下线，敬请期待新版。
    </p>
    <NuxtLink to="/" class="mt-6 text-[var(--color-primary,#409EFF)]">回到首页</NuxtLink>
  </div>
</template>

<script setup lang="ts">
throw createError({
  statusCode: 404,
  statusMessage: '该工具页暂不可用',
  fatal: false,
})
</script>
