export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) { context = args = null }
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) { timeout = setTimeout(later, wait) }
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/**
 * 判断元素是否有className
 * @param {Object[Element]} el
 * @param {String} cls className
 * @returns {Boolean}
 */
export function hasClass (el, cls) {
  if (!el || !cls) { return false }
  if (cls.includes(' ')) { throw new Error('className should not contain space.') }
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').includes(' ' + cls + ' ')
  }
}

/**
 * 给元素添加className
 * @param {Object[Element]} el
 * @param {String} cls className
 */
export function addClass (el, cls) {
  if (!el) { return }
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) { continue }

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.setAttribute('class', curClass)
  }
}

/**
 * 给元素移除className
 * @param {Object[Element]} el
 * @param {String} cls className
 */
export function removeClass (el, cls) {
  if (!el || !cls) { return }
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) { continue }

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.setAttribute('class', trim(curClass))
  }
}

export function sleep (wait) {
  return new Promise(resolve => setTimeout(resolve, wait))
}
