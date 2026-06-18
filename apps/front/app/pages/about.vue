<template>
  <div>
    <h1 class="py-2.5 text-3xl font-normal text-[var(--color-heading)] text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">关于</h1>
    <div class="py-2.5 pb-[var(--grid-space)] text-[15px] text-[var(--color-secondary)]">
      <span class="text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
        生活总是两难，再多执着，再多不肯，最终不得不学会接受，从哭着控制，到笑着对待，到头来不过是一场随遇而安。<br>
        别想太多，一切都会过去的。
      </span>
    </div>

    <div class="mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]">
      <div class="flex p-[var(--grid-space)] lt-xl:flex-col-reverse">
        <Catalog v-if="isLoaded" class="flex-shrink-0" />
        <div id="js-content" class="flex-1 min-w-0 overflow-hidden markup" v-html="content" />
      </div>
    </div>
    <WalineComment />
    <Adsense />
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const route = useRoute()
const { fetchCategory } = useApi()

const isLoaded = ref(false)
const content = ref('')

usePageSeo({ pageType: 'page', pageName: '关于本站' })

const { data } = await useAsyncData('about', async () => {
  const findCategory = appStore.categories.find(
    item => item.filename && route.path.includes(item.filename),
  )
  if (findCategory) {
    const categoryData = await fetchCategory(findCategory.id).catch(() => null)
    return categoryData?.content || ''
  }
  return ''
})

content.value = data.value || ''

onMounted(() => {
  nextTick(() => { isLoaded.value = true })
})
</script>
