// 网站配置
export interface SiteConfig {
  sitename: string
  keywords: string
  description: string
  is_silent: number | string
  article_width: number
  article_height: number
  bangumi_width: number
  bangumi_height: number
  [key: string]: any
}

// 分类/导航菜单
export interface Category {
  id: number
  name: string
  type: string // 'article' | 'bangumi' | 'archives' | 'about' | 'link'
  icon: string
  filename?: string
  is_nav: boolean | number
  parent_id: number | null
  keywords?: string
  description?: string
  sort?: number
  content?: string
  children?: Category[]
}

// 文章
export interface Article {
  id: number
  title: string
  description: string
  content: string
  imgurl: string
  category_id: number
  tag: string
  hits: number
  word_count: number
  keywords?: string
  addtime: string
  updatetime: string
  pathname?: string
  // computed
  categoryUrl?: string
  categoryName?: string
  parsedTags?: string[]
}

// 追番
export interface Bangumi {
  id: number
  title: string
  description: string
  content: string
  imgurl: string
  category_id: number
  tag: string
  status: number // 0-未上映 1-连载 2-完结
  progress: number // 0-在看 1-看过
  current: number
  total: number
  ratings: number
  showtime: string
  songs?: string
  addtime: string
  updatetime: string
  pathname?: string
  // computed
  parsedTags?: string[]
}

// Banner 轮播
export interface Banner {
  id: number
  title: string
  imgurl: string
  sort?: number
}

// 友情链接
export interface FriendLink {
  id: number
  name: string
  website: string
  logo: string
  description: string
  sort?: number
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  pageSize: number
}

// 通用接口包装
export interface ApiResponse<T> {
  errno: number
  errmsg?: string
  data?: T
}
