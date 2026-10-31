<template>
  <div
    class="py-[var(--grid-space)] text-sm leading-snug text-[var(--color-heading)]"
  >
    <p class="mb-1 text-center lt-sm:hidden">
      Power by ThinkJS + Nuxt.js，已经稳稳地存活了 {{ configs?.duration }}
      <a
        class="ml-2 inline-block align-middle"
        href="https://www.foreverblog.cn/go.html"
        rel="noopener noreferrer"
        target="_blank"
        title="虫洞 · 随机访问十年之约成员博客"
        ><img
          class="inline-block h-8 w-auto dark:hidden"
          src="https://www.foreverblog.cn/assets/logo/wormhole_v2_dark.webp"
          alt="十年之约虫洞"
        ><img
          class="hidden h-8 w-auto dark:inline-block"
          src="https://www.foreverblog.cn/assets/logo/wormhole_v2_light.webp"
          alt="十年之约虫洞"
      ></a>
    </p>
    <p class="text-center">
      <span
        >Copyright © 2018 - {{ currentYear }} Timeless. All rights
        reserved.</span
      >
      <a
        v-if="configs?.icp_beian"
        class="ml-2.5 text-[var(--color-primary)] lt-sm:hidden"
        href="https://beian.miit.gov.cn/"
        rel="noopener noreferrer"
        target="_blank"
        title="ICP/IP地址/域名信息备案管理系统"
        >{{ configs.icp_beian }}</a
      >
      <a
        v-if="configs?.police_beian"
        class="ml-2.5 text-[var(--color-primary)] lt-sm:hidden"
        href="http://www.beian.gov.cn"
        rel="noopener noreferrer"
        target="_blank"
        title="全国互联网安全管理服务平台"
        ><img
          class="inline-block"
          width="20"
          height="20"
          src="@/assets/image/icp-beian.png"
          alt="公网安备"
        >{{ configs.police_beian }}</a
      >
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  configs?: Record<string, string>;
}>();

const currentYear = new Date().getFullYear();
</script>
