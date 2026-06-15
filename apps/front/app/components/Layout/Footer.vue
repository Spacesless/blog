<template>
  <div class="py-[var(--grid-space)] text-sm leading-snug text-[var(--color-heading)]">
    <p class="mb-1 text-center lt-sm:hidden">
      Powered by Node.js + Nuxt 4 + Directus
      <template v-if="configs?.duration">
        ，已经稳稳地存活了 {{ configs.duration }}
      </template>
    </p>
    <p class="text-center">
      <span>Copyright © 2018 - {{ currentYear }} Timeless. All rights reserved.</span>
      <a
        v-if="configs?.icp_beian"
        class="ml-2.5 text-[var(--color-primary)] lt-sm:hidden"
        href="https://beian.miit.gov.cn/"
        rel="noopener noreferrer"
        target="_blank"
        title="ICP/IP地址/域名信息备案管理系统"
      >{{ configs.icp_beian }}</a>
      <a
        v-if="configs?.police_beian"
        class="ml-2.5 text-[var(--color-primary)] lt-sm:hidden"
        href="http://www.beian.gov.cn"
        rel="noopener noreferrer"
        target="_blank"
        title="全国互联网安全管理服务平台"
      >{{ configs.police_beian }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  configs?: Record<string, any>
}>()

const currentYear = new Date().getFullYear()
</script>
