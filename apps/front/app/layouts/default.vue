<template>
  <div class="relative max-w-1200px min-h-screen mx-auto px-4" :class="classObj">
    <LayoutHeader />
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="fixed inset-0 z-999 bg-black/50"
      @click="handleClickOutside"
    />
    <LayoutSidebar />
    <div class="main transition-[margin] duration-300" :class="mainClass">
      <slot />
      <LayoutFooter :configs="configs" />
    </div>
    <LayoutBackground :particle-active="particleActive" />
    <LayoutFixedBar />
    <LayoutLive2d />
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const toolsStore = useToolsStore()
const route = useRoute()

const { device, configs } = storeToRefs(appStore)
const { sidebar, particleActive } = storeToRefs(toolsStore)

const { fetchGeneral } = useApi()
const { data: initData } = await useAsyncData('app-init', () =>
  fetchGeneral().catch(() => ({ categories: [], configs: {} as any })),
)

if (initData.value) {
  appStore.setCategories((initData.value.categories || []) as any)
  appStore.setConfigs((initData.value.configs || {}) as any)
}

useResize()

onMounted(() => {
  toolsStore.initSidebar()
})

const classObj = computed(() => ({
  hideAside: !sidebar.value.opened,
  openAside: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile',
}))

const mainClass = computed(() => {
  if (classObj.value.mobile) {
    return {
      'ml-0': true,
      'pt-[60px]': true,
      'transition-none': classObj.value.withoutAnimation,
    }
  }
  return {
    'pt-4': true,
    'ml-[calc(var(--aside-width)+var(--grid-space))]': !classObj.value.hideAside,
    'ml-[88px]': classObj.value.hideAside,
    'transition-none': classObj.value.withoutAnimation,
  }
})

function handleClickOutside() {
  toolsStore.closeSidebar(false)
}

watch(
  () => route.name,
  async (name) => {
    if (import.meta.client) {
      await nextTick()
      const isSilent = name === 'index' && Number(configs.value?.is_silent)
      document.documentElement.classList.toggle('silent', !!isSilent)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.main > :slotted(*) {
  min-height: calc(100vh - 103px);
}
</style>
