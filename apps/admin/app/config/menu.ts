export interface MenuItem {
  path: string
  name?: string
  hidden?: boolean
  redirect?: string
  alwaysShow?: boolean
  meta?: {
    title?: string
    icon?: string
    affix?: boolean
    noCache?: boolean
    activeMenu?: string
  }
  children?: MenuItem[]
}

export const menuRoutes: MenuItem[] = [
  {
    path: '/',
    name: 'HomePage',
    meta: { title: '首页', icon: 'dashboard', affix: true },
  },
  {
    path: '/content',
    redirect: '/content/article',
    meta: { title: '内容管理', icon: 'content' },
    children: [
      { path: '/content/article', name: 'ArticleList', meta: { title: '文章模块' } },
      { path: '/content/bangumi', name: 'BangumiList', meta: { title: '番剧模块' } },
      { path: '/content/create', name: 'ContentCreate', hidden: true, meta: { title: '新增文章', noCache: true } },
      { path: '/content/edit/:id', name: 'ContentEdit', hidden: true, meta: { title: '修改文章', noCache: true } },
      { path: '/content/recycle', name: 'RecycleList', meta: { title: '回收站' } },
    ],
  },
  {
    path: '/category',
    redirect: '/category/list',
    meta: { title: '栏目管理', icon: 'category' },
    children: [
      { path: '/category', name: 'CategoryList', meta: { title: '栏目列表' } },
      { path: '/category/edit/:id', name: 'CategoryEdit', hidden: true, meta: { title: '栏目内容', noCache: true } },
      { path: '/category/create', name: 'CategoryCreate', hidden: true, meta: { title: '栏目内容', noCache: true } },
    ],
  },
  {
    path: '/community',
    redirect: '/community/link',
    meta: { title: '社区管理', icon: 'community' },
    children: [
      { path: '/community/link', name: 'LinkList', meta: { title: '友情链接' } },
    ],
  },
  {
    path: '/profile',
    name: 'OptionsProfile',
    meta: { title: '用户管理', icon: 'member', noCache: true },
  },
  {
    path: '/system',
    redirect: '/system/general-config',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      { path: '/system/general-config', name: 'GeneralConfig', meta: { title: '常规配置', noCache: true } },
      { path: '/system/reading-config', name: 'ReadingConfig', meta: { title: '阅读设置', noCache: true } },
      { path: '/system/banner-config', name: 'BannerConfig', meta: { title: 'Banner管理' } },
    ],
  },
]
