/**
 * 响应式布局 composable
 * 替代 Nuxt 2 的 ResizeHandler mixin
 */
export function useResize() {
  const appStore = useAppStore()
  const toolsStore = useToolsStore()
  const route = useRoute()

  const WIDTH = 992
  const MDWIDTH = 1280

  function getScreenSize() {
    const rect = document.body.getBoundingClientRect()
    return {
      isMobile: rect.width + 7 < WIDTH,
      isMiddleWidth: rect.width + 7 < MDWIDTH,
    }
  }

  function handleResize() {
    if (document.hidden) return
    const { isMobile, isMiddleWidth } = getScreenSize()
    appStore.setDevice(isMobile ? 'mobile' : 'desktop')
    if (isMiddleWidth) {
      toolsStore.closeSidebar(true)
    } else {
      toolsStore.openSidebar(true)
    }
  }

  onMounted(() => {
    const { isMobile, isMiddleWidth } = getScreenSize()
    if (isMobile) {
      appStore.setDevice('mobile')
      toolsStore.setParticle(false)
      toolsStore.setLive2d(false)
    } else {
      toolsStore.setParticle(true)
      toolsStore.setLive2d(true)
    }
    if (isMiddleWidth) {
      toolsStore.closeSidebar(true)
    } else {
      toolsStore.openSidebar(true)
    }

    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  // 路由变化时关闭移动端侧边栏
  watch(() => route.path, () => {
    if (appStore.device === 'mobile' && toolsStore.sidebar.opened) {
      toolsStore.closeSidebar(false)
    }
  })
}
