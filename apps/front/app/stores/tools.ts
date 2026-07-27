import { defineStore } from 'pinia'

export const useToolsStore = defineStore('tools', () => {
  const sidebar = ref({
    opened: true,
    withoutAnimation: false,
  })
  const particleActive = ref(false)
  const live2dShow = ref(false)

  // 在客户端初始化时从 cookie 恢复侧边栏状态
  function initSidebar() {
    if (import.meta.client) {
      const cookie = useCookie<string>('sidebarStatus')
      sidebar.value.opened = cookie.value ? !!Number(cookie.value) : true
    }
  }

  function toggleSidebar() {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
    if (import.meta.client) {
      const cookie = useCookie<string>('sidebarStatus')
      cookie.value = sidebar.value.opened ? '1' : '0'
    }
  }

  function openSidebar(withoutAnimation = false) {
    sidebar.value.opened = true
    sidebar.value.withoutAnimation = withoutAnimation
    if (import.meta.client) {
      const cookie = useCookie<string>('sidebarStatus')
      cookie.value = '1'
    }
  }

  function closeSidebar(withoutAnimation = false) {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
    if (import.meta.client) {
      const cookie = useCookie<string>('sidebarStatus')
      cookie.value = '0'
    }
  }

  function setParticle(isShow: boolean) {
    particleActive.value = isShow
  }

  function setLive2d(isShow: boolean) {
    live2dShow.value = isShow
  }

  return {
    sidebar,
    particleActive,
    live2dShow,
    initSidebar,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setParticle,
    setLive2d,
  }
})
