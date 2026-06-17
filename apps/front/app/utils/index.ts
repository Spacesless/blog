/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate = false) {
  let timeout: ReturnType<typeof setTimeout> | null
  let timestamp: number
  let result: any

  const later = function (this: any) {
    const last = Date.now() - timestamp
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(this, arguments as any)
      }
    }
  }

  return function (this: any, ...args: Parameters<T>) {
    timestamp = Date.now()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(this, args)
    }
    return result
  }
}

/**
 * 判断元素是否有 className
 */
export function hasClass(el: Element, cls: string): boolean {
  if (!el || !cls) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')
  return el.classList.contains(cls)
}

/**
 * 给元素添加 className
 */
export function addClass(el: Element, cls: string): void {
  if (!el) return
  const classes = (cls || '').split(' ')
  for (const clsName of classes) {
    if (clsName) el.classList.add(clsName)
  }
}

/**
 * 给元素移除 className
 */
export function removeClass(el: Element, cls: string): void {
  if (!el || !cls) return
  const classes = cls.split(' ')
  for (const clsName of classes) {
    if (clsName) el.classList.remove(clsName)
  }
}

/**
 * 等待指定时间
 */
export function sleep(wait: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, wait))
}

/**
 * 格式化时间
 */
export function parseTime(time: string | number | Date, format = '{y}-{m}-{d} {h}:{i}:{s}'): string {
  if (!time) return ''
  const date = new Date(time)
  const formatObj: Record<string, number> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return format.replace(/\{([ymdhisa])+\}/g, (_result, key) => {
    const value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
}

/**
 * 计算 tag 的 className
 */
export function tagClassName(tag: string): string {
  const nameEnum = ['red', 'geekblue', 'orange', 'cyan', 'green', 'blue', 'purple', 'magenta']
  const enumLength = nameEnum.length
  let tagLength = 0
  for (let i = 0; i < tag.length; i++) {
    tagLength += tag.charCodeAt(i)
  }
  const findName = nameEnum[tagLength % enumLength]
  return findName ? `tl-tag--${findName}` : ''
}

/**
 * 格式化番剧状态
 */
export function bangumiStatus(status: number): string {
  const statusList = ['未上映', '连载中', '已完结']
  return statusList[status || 0]
}

/**
 * 获取图片 srcset
 */
export function getImageSrcSet(src: string, width = 576): string {
  if (!src) return ''
  const halfWidth = width / 2
  const smallWidth = halfWidth < 576 ? 576 : halfWidth
  return `${src}?imageMogr2/thumbnail/!50p ${smallWidth}w, ${src}`
}

/**
 * 获取绝对路径 (Directus 资源文件)
 */
export function getAbsolutePath(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // 使用 public 目录路径
  return path
}

/**
 * 将扁平数组转为树形结构
 */
export function convertToTree<T extends { id: number; parent_id: number | null; children?: T[] }>(list: T[]): T[] {
  const map = new Map<number, T>()
  const roots: T[] = []

  list.forEach(item => {
    map.set(item.id, { ...item, children: [] })
  })

  map.forEach(item => {
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children!.push(item)
    } else {
      roots.push(item)
    }
  })

  return roots
}

/**
 * 滚动到指定位置
 */
export function scrollTo(to: number, duration = 500, callback?: () => void): void {
  const start = window.pageYOffset
  const change = to - start
  const increment = 20
  let currentTime = 0

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }

  const animateScroll = () => {
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    window.scrollTo(0, val)
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      callback?.()
    }
  }

  animateScroll()
}

/**
 * 获取当前滚动位置
 */
export function getScrollPosition(): number {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
}

/**
 * 生成详情页 URL，优先使用 slug (pathname)
 */
export function detailUrl(type: 'article' | 'bangumi', item: { id: number; pathname?: string | null }): string {
  return `/${type}/detail/${item.pathname || item.id}`
}
