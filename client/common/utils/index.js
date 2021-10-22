/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        time = parseInt(time)
      } else if (time.includes('-') && !/[A-Z]/.test(time)) { // 兼容ie、uniapp
        time = time.replace(/-/gi, '/')
      }
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 获取localStorage
 * @param {String} key localStorage键名
 * @returns {Object} 格式化的json数据
 */
export function getLocalStorage(key) {
  const data = localStorage.getItem(key)
  let result
  try {
    result = data ? JSON.parse(data) : {}
  } catch {
    result = ''
  }
  return result
}

/**
 * 设置localStorage
 * @param {String} key localStorage键名
 * @param {Object} data 数据
 */
export function setLocalStorage(key, data) {
  const format = typeof data === 'object' ? JSON.stringify(data) : data
  localStorage.setItem(key, format)
}

/**
 * 更新localStorage
 * @param {String} key localStorage键名
 * @param {Object} data 数据
 */
export function updateLocalStorage(key, data) {
  const source = JSON.parse(localStorage.getItem(key))
  if (typeof source === 'object' && typeof data === 'object') {
    const format = Object.assign(source, data)
    localStorage.setItem(key, JSON.stringify(format))
  } else {
    localStorage.setItem(key, data)
  }
}

/**
 * 获取绝对路径
 * @param {String} src 源路径
 * @returns  {String}
 */
export function getAbsolutePath(url) {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? url : `${url ? '//cdn.timelessq.com' + url : ''}`
}
