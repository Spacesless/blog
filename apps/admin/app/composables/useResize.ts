const WIDTH = 992

export function useResize() {
  const appStore = useAppStore()
  const route = useRoute()

  function isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function resizeHandler() {
    if (!document.hidden) {
      const mobile = isMobile()
      appStore.toggleDevice(mobile ? 'mobile' : 'desktop')
      if (mobile) appStore.closeSideBar({ withoutAnimation: true })
    }
  }

  watch(
    () => route.path,
    () => {
      if (appStore.device === 'mobile' && appStore.sidebar.opened) {
        appStore.closeSideBar({ withoutAnimation: false })
      }
    },
  )

  onMounted(() => {
    if (isMobile()) {
      appStore.toggleDevice('mobile')
      appStore.closeSideBar({ withoutAnimation: true })
    }
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}
