import type { Category, SiteConfig } from '~/types'

interface PageMetaOptions {
  pageType?: 'page' | 'list' | 'detail'
  pageName?: string
  data?: { title?: string; keywords?: string; description?: string; category_id?: number }
}

/**
 * 设置页面 SEO Meta
 * 替代 Nuxt 2 的 pageMeta mixin
 */
export function usePageSeo(options: PageMetaOptions = {}) {
  const { pageType = 'page', pageName = '', data } = options
  const appStore = useAppStore()
  const route = useRoute()

  const findCategory = computed<Category | undefined>(() => {
    const categories = appStore.categories
    switch (pageType) {
      case 'list': {
        const paramId = route.params.id as string
        const [id] = paramId?.split('-') || []
        return id ? categories.find(item => item.id === Number(id)) : undefined
      }
      case 'detail': {
        const categoryId = data?.category_id
        return categories.find(item => item.id === categoryId)
      }
      default:
        return categories.find(item => item.filename && route.path.includes(item.filename!))
    }
  })

  const seoMeta = computed(() => {
    const configs = appStore.configs
    const category = findCategory.value

    if (pageType === 'detail' && data) {
      return {
        title: `${data.title}${category?.name ? ' - ' + category.name : ''} - ${configs.sitename}`,
        keyword: data.keywords || configs.keywords,
        description: data.description || configs.description,
      }
    }

    const pageTitle = pageName || category?.name
    return {
      keyword: category?.keywords || configs.keywords,
      description: category?.description || configs.description,
      title: pageTitle ? `${pageTitle} - ${configs.sitename}` : configs.sitename,
    }
  })

  useHead({
    title: seoMeta.value.title,
    meta: [
      { name: 'description', content: seoMeta.value.description },
      { name: 'keywords', content: seoMeta.value.keyword },
    ],
  })

  // 详情页设置侧边菜单激活状态
  if (pageType === 'detail' && findCategory.value) {
    const { id, type } = findCategory.value
    appStore.setActiveMenu(id ? `/${type}/${id}` : '')
  }

  return { seoMeta, findCategory }
}
