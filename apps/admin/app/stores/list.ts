import { defineStore } from 'pinia'

interface CategoryItem {
  id: number
  name: string
  parent_id?: number
  [k: string]: any
}

export const useListStore = defineStore('list', {
  state: () => ({
    category: [] as CategoryItem[],
    updateRoute: '',
  }),
  getters: {
    categories: state => state.category,
  },
  actions: {
    async getCategory() {
      const api = useApi()
      try {
        const res: any = await api.GetList('category', { count: -1 })
        this.category = res.data?.data || res.data || []
      } catch (e) {
        console.error(e)
      }
    },
    setUpdateRoute(name: string) {
      this.updateRoute = name
    },
  },
})
