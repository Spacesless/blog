<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
    <div class="text-8xl font-display text-ink-200/30">
      {{ error?.statusCode || 500 }}
    </div>
    <h1 class="mt-4 text-2xl font-serif text-[var(--color-heading,#222)]">
      {{ error?.statusMessage || '页面出错了' }}
    </h1>
    <p v-if="error?.message" class="mt-2 max-w-xl text-sm text-[var(--color-text,#666)]">
      {{ error.message }}
    </p>
    <div class="mt-8 flex gap-4">
      <el-button type="primary" @click="handleHome">返回首页</el-button>
      <el-button @click="handleBack">上一页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorObject {
  statusCode?: number
  statusMessage?: string
  message?: string
}

defineProps<{ error: ErrorObject | null }>()

function handleHome() {
  clearError({ redirect: '/' })
}

function handleBack() {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
  } else {
    clearError({ redirect: '/' })
  }
}
</script>
