import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

interface AppState {
  sidebar: { opened: boolean; withoutAnimation: boolean }
  device: 'desktop' | 'mobile'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus')! : true,
      withoutAnimation: false,
    },
    device: 'desktop',
  }),
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      Cookies.set('sidebarStatus', this.sidebar.opened ? '1' : '0')
    },
    closeSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
      Cookies.set('sidebarStatus', '0')
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleDevice(device: 'desktop' | 'mobile') {
      this.device = device
    },
  },
})
