import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

export interface TagViewItem {
  path: string
  fullPath: string
  name?: string
  title?: string
  affix?: boolean
  meta?: Record<string, any>
}

function normalize(view: RouteLocationNormalized | TagViewItem): TagViewItem {
  if ('meta' in view && view.meta) {
    return {
      path: view.path,
      fullPath: (view as any).fullPath || view.path,
      name: (view.name as string | undefined) || undefined,
      title: ((view.meta as any)?.title as string) || 'no-name',
      affix: !!(view.meta as any)?.affix,
      meta: view.meta as Record<string, any>,
    }
  }
  return view as TagViewItem
}

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [] as TagViewItem[],
    cachedViews: [] as string[],
  }),
  actions: {
    addView(view: RouteLocationNormalized | TagViewItem) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    addVisitedView(view: RouteLocationNormalized | TagViewItem) {
      const n = normalize(view)
      if (this.visitedViews.some(v => v.path === n.path)) return
      this.visitedViews.push(n)
    },
    addCachedView(view: RouteLocationNormalized | TagViewItem) {
      const n = normalize(view)
      if (!n.name) return
      if (this.cachedViews.includes(n.name)) return
      if (n.meta?.noCache) return
      this.cachedViews.push(n.name)
    },
    updateVisitedView(view: RouteLocationNormalized | TagViewItem) {
      const n = normalize(view)
      this.visitedViews = this.visitedViews.map(v => (v.path === n.path ? { ...v, ...n } : v))
    },
    delView(view: TagViewItem | RouteLocationNormalized): Promise<{ visitedViews: TagViewItem[]; cachedViews: string[] }> {
      const n = normalize(view)
      this.delVisitedView(n)
      this.delCachedView(n)
      return Promise.resolve({ visitedViews: [...this.visitedViews], cachedViews: [...this.cachedViews] })
    },
    delVisitedView(view: TagViewItem) {
      this.visitedViews = this.visitedViews.filter(v => v.path !== view.path || v.affix)
    },
    delCachedView(view: TagViewItem | RouteLocationNormalized): Promise<string[]> {
      const n = normalize(view)
      if (n.name) this.cachedViews = this.cachedViews.filter(name => name !== n.name)
      return Promise.resolve([...this.cachedViews])
    },
    delOthersViews(view: TagViewItem): Promise<{ visitedViews: TagViewItem[]; cachedViews: string[] }> {
      this.visitedViews = this.visitedViews.filter(v => v.affix || v.path === view.path)
      this.cachedViews = view.name ? [view.name] : []
      return Promise.resolve({ visitedViews: [...this.visitedViews], cachedViews: [...this.cachedViews] })
    },
    delAllViews(): Promise<{ visitedViews: TagViewItem[]; cachedViews: string[] }> {
      this.visitedViews = this.visitedViews.filter(v => v.affix)
      this.cachedViews = []
      return Promise.resolve({ visitedViews: [...this.visitedViews], cachedViews: [...this.cachedViews] })
    },
  },
})
