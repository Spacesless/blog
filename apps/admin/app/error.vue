<template>
  <div class="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
    <div class="text-center px-6">
      <h1 class="text-8xl font-bold text-gray-300">{{ error?.statusCode || 500 }}</h1>
      <p class="mt-4 text-xl text-gray-600">{{ error?.statusMessage || '页面出错了' }}</p>
      <el-button class="mt-6" type="primary" @click="handleHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } | null }>()

function handleHome() {
  clearError({ redirect: '/' })
}
</script>
