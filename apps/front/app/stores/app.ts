import { defineStore } from 'pinia'
import type { Category, SiteConfig } from '~/types'

export const useAppStore = defineStore('app', () => {
  const categories = ref<Category[]>([])
  const configs = ref<SiteConfig>({} as SiteConfig)
  const device = ref<'desktop' | 'mobile'>('desktop')
  const activeMenu = ref('')

  function setCategories(data: Category[]) {
    categories.value = data
  }

  function setConfigs(data: SiteConfig) {
    configs.value = data
  }

  function setDevice(val: 'desktop' | 'mobile') {
    device.value = val
  }

  function setActiveMenu(val: string) {
    activeMenu.value = val
  }

  return {
    categories,
    configs,
    device,
    activeMenu,
    setCategories,
    setConfigs,
    setDevice,
    setActiveMenu,
  }
})
