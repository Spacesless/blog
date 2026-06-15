<template>
  <el-scrollbar
    ref="scrollContainer"
    class="scroll-container"
    :vertical="false"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup lang="ts">
import type { ElScrollbar } from 'element-plus'

const tagAndTagSpacing = 4
const scrollContainer = ref<InstanceType<typeof ElScrollbar> | null>(null)

const scrollWrapper = computed(() => scrollContainer.value?.wrapRef as HTMLElement | undefined)

function handleScroll(e: WheelEvent) {
  const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
  if (scrollWrapper.value) {
    scrollWrapper.value.scrollLeft = scrollWrapper.value.scrollLeft + eventDelta / 4
  }
}

function moveToTarget(currentTag: HTMLElement) {
  const $container = scrollWrapper.value
  if (!$container) return
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = $container
  const tagList = ($scrollWrapper.querySelectorAll('.tags-view-item') as NodeListOf<HTMLElement>)
  let firstTag = null as HTMLElement | null
  let lastTag = null as HTMLElement | null
  if (tagList.length) {
    firstTag = tagList[0]!
    lastTag = tagList[tagList.length - 1]!
  }
  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    const tagListDom = Array.from(tagList)
    const currentIndex = tagListDom.findIndex(item => item === currentTag)
    const prevTag = tagListDom[currentIndex - 1]
    const nextTag = tagListDom[currentIndex + 1]
    if (!prevTag || !nextTag) return
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing
    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

defineExpose({ moveToTarget })
</script>

<style lang="scss" scoped>
.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  :deep(.el-scrollbar__bar) {
    bottom: 0;
  }

  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
