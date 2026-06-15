/**
 * 格式化时间
 */
export function parseTime(time: string | number | Date | null | undefined, format = '{y}-{m}-{d} {h}:{i}:{s}'): string {
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
      return ['日', '一', '二', '三', '四', '五', '六'][value as number]
    }
    return String(value).padStart(2, '0')
  })
}

/**
 * 防抖
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate = false) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }, wait)
    if (callNow) func.apply(this, args)
  }
}

/**
 * 将扁平数组转为树形结构
 */
export function convertToTree<T extends { id: number; parent_id?: number | null; children?: T[] }>(list: T[]): T[] {
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
 * 根据类型获取栏目（树）
 */
export function getCategoryByType<T extends { id: number; type?: string; parent_id?: number | null; name?: string; children?: T[] }>(
  categories: T[],
  type?: string,
): (T & { value: number; label: string })[] {
  const filtered = categories
    .filter(item => (type ? item.type === type : true))
    .map(item => ({ ...item, value: item.id, label: item.name || '' }))
  return convertToTree(filtered as any) as any
}

/**
 * 获取路径信息
 */
export function getPathName(path: string) {
  const pathSplit = path.split('/')
  const basename = pathSplit.pop() || ''
  const [filename, extname] = basename.split('.')
  return {
    dirname: pathSplit.join('/'),
    basename,
    filename: filename || '',
    extname: extname ? '.' + extname : '',
  }
}

/**
 * 滚动到容器内指定位置
 */
export function scrollTo(to: number, duration = 500, container: HTMLElement | Window = window) {
  const isWin = container === window
  const start = isWin ? window.pageYOffset : (container as HTMLElement).scrollTop
  const change = to - start
  const startTime = performance.now()
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const val = start + change * ease(progress)
    if (isWin) window.scrollTo(0, val)
    else (container as HTMLElement).scrollTop = val
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
