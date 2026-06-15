import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    configs: {} as Record<string, any>,
  }),
  actions: {
    async getConfigs() {
      const api = useApi()
      try {
        const res: any = await api.GetConfigs()
        this.configs = { ...this.configs, ...(res.data || {}) }
      } catch (e) {
        console.error(e)
      }
    },
    async updateConfigs(data: Record<string, any>) {
      const api = useApi()
      await api.UpdateConfigs(data)
    },
  },
})
