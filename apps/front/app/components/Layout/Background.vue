<template>
  <div class="fixed inset-0 -z-1 overflow-hidden pointer-events-none opacity-65 bg-[url('/background.png')] bg-no-repeat bg-[length:30%_auto] bg-right-top">
    <canvas v-show="particleActive" id="flower" ref="canvasRef" width="1900" height="1080" class="w-full h-full" />
    <div
      class="fixed -top-1/2 -left-1/2 w-[200%] h-[200%] origin-bottom"
      :class="[
        isShowChange ? 'animate-[theme-rotate_2s_cubic-bezier(0.7,0,0,1)]' : '',
        isDark ? 'theme--dark' : ''
      ]"
    >
      <div class="absolute top-[30%] left-[58%] w-10 h-10 rounded-full bg-[#ffc53d] shadow-[0_0_32px_#ffc53d] transition-opacity duration-1000 delay-1000 theme__sun" />
      <div class="absolute top-[30%] left-[58%] w-10 h-10 rounded-full bg-[#f5f5f5] shadow-[0_0_32px_#f5f5f5] opacity-0 transition-opacity duration-1000 delay-1000 theme__moon" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  particleActive: boolean
}>()

const colorMode = useColorMode()
const canvasRef = ref<HTMLCanvasElement>()
const isShowChange = ref(false)
const isDark = computed(() => colorMode.preference === 'dark')

let timer: ReturnType<typeof setTimeout> | null = null

watch(isDark, () => {
  isShowChange.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    isShowChange.value = false
  }, 2000)
})

watch(
  () => props.particleActive,
  async (val) => {
    if (val && import.meta.client) {
      // placeholder for particle vendor
    }
  },
  { immediate: false },
)
</script>

<style scoped>
.theme--dark .theme__sun { opacity: 0; }
.theme--dark .theme__moon { opacity: 1; }

@keyframes theme-rotate {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
</style>
