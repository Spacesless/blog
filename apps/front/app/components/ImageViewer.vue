<template>
  <el-image-viewer
    v-if="visible"
    :url-list="previewSrcList"
    :initial-index="initialIndex"
    @close="visible = false"
  />
</template>

<script setup lang="ts">
const visible = ref(false)
const initialIndex = ref(0)
const previewSrcList = ref<string[]>([])

function initViewer() {
  const previews = document.querySelectorAll<HTMLImageElement>('.markup img')
  previewSrcList.value = Array.from(previews).map(item => item.src)
  previews.forEach((item, idx) => {
    item.addEventListener('click', () => {
      initialIndex.value = idx
      visible.value = true
    })
  })
}

onMounted(() => {
  nextTick(initViewer)
})
</script>
