import type { Directive, DirectiveBinding } from 'vue'
import { useDebounceFn } from '@vueuse/core'

/**
 * 表格高度自适应指令
 * 用法: <el-table v-el-height-adaptive-table="{bottomOffset: 30}">
 * bottomOffset: 表格距离页面底部的偏移量，默认 30
 */

interface AdaptiveConfig {
  bottomOffset?: number
}

const doResize = (el: HTMLElement, binding: DirectiveBinding<AdaptiveConfig>) => {
  const { value } = binding
  const bottomOffset = value?.bottomOffset ?? 30

  // 指令绑定在 el-table 根元素上，若不是则向内查找
  const tableEl = el.classList.contains('el-table')
    ? el
    : (el.querySelector('.el-table') as HTMLElement | null)
  if (!tableEl) return

  // 计算表格应该的高度
  const rect = tableEl.getBoundingClientRect()
  const height = window.innerHeight - rect.top - bottomOffset

  // 设置表格高度
  if (height > 0) {
    tableEl.style.height = `${height}px`
  }
}

export const elHeightAdaptiveTable: Directive<HTMLElement, AdaptiveConfig> = {
  mounted(el, binding) {
    // 创建防抖的 resize 监听器
    const resizeListener = useDebounceFn(() => {
      doResize(el, binding)
    }, 100)

    // 存储监听器引用以便后续移除
    ;(el as any)._resizeListener = resizeListener

    // 监听窗口 resize 事件
    window.addEventListener('resize', resizeListener)

    // 初始化时执行一次
    nextTick(() => {
      doResize(el, binding)
    })
  },

  updated(el, binding) {
    // 指令绑定值更新时重新计算
    nextTick(() => {
      doResize(el, binding)
    })
  },

  unmounted(el) {
    // 移除事件监听
    const resizeListener = (el as any)._resizeListener
    if (resizeListener) {
      window.removeEventListener('resize', resizeListener)
      delete (el as any)._resizeListener
    }
  },
}
