<template>
  <div v-if="catalogList.length" class="relative" :class="{ 'w-0 pt-4': !isShowCatalog }">
    <div v-show="isShowCatalog" class="sticky top-0 w-50 lt-xl:static lt-xl:w-full">
      <p class="relative h-10 px-4 mb-2 leading-10 text-[var(--color-secondary)] border-b border-dashed border-[var(--border-color)]">
        <Icon name="ph:book-open-text" class="mr-1" />
        <span>文章目录</span>
        <Icon name="ph:x" class="absolute top-2.5 right-3 text-lg cursor-pointer" @click="toggleShow" />
      </p>
      <el-scrollbar class="max-h-[calc(100vh-60px)]" tag="ul">
        <li
          v-for="(item, index) in catalogList"
          :key="index"
          class="mx-2.5 text-sm leading-[30px] text-[var(--color-text)] cursor-pointer list-none"
          :class="[
            item.nodeName === 'H3' ? 'pl-2.5' : item.nodeName === 'H4' ? 'pl-5' : '',
            index === activeIndex ? 'text-[var(--color-primary)]!' : '',
          ]"
          :title="item.innerText"
          @click="scrollIntoView(index)"
        >
          {{ item.innerText }}
        </li>
      </el-scrollbar>
    </div>
    <span
      v-show="!isShowCatalog"
      class="sticky top-4 inline-block w-3 p-1 text-xs text-white cursor-pointer rounded-r-md bg-gradient-to-br from-[#24c6dc] via-[var(--color-primary)] to-[#5433ff]"
      @click="toggleShow"
    >文章目录</span>
  </div>
</template>

<script setup lang="ts">
const catalogList = ref<HTMLHeadingElement[]>([])
const activeIndex = ref(-1)
const isShowCatalog = ref(true)

function initCatalog() {
  const markupElement = document.getElementById('js-content')
  if (!markupElement) return
  catalogList.value = Array.from(
    markupElement.querySelectorAll('h2,h3,h4'),
  ) as HTMLHeadingElement[]

  window.addEventListener('scroll', onScroll)
}

function onScroll() {
  let index = -1
  for (let i = 0; i < catalogList.value.length; i++) {
    const el = catalogList.value[i]
    const { top, height } = el.getBoundingClientRect()
    if (top <= height) index = i
  }
  activeIndex.value = index
}

function scrollIntoView(index: number) {
  scrollTo(catalogList.value[index].offsetTop, 500)
}

function toggleShow() {
  isShowCatalog.value = !isShowCatalog.value
}

onMounted(() => {
  nextTick(() => initCatalog())
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
