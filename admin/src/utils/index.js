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
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 栏目数组转换成树形结构
 * @param {Array} category 栏目数组
 * @returns {Array} 栏目树形结果数组
 */
export function formatCategory(categorys, parentid = 0) {
  const tree = []
  let temp
  const cloneCategory = JSON.parse(JSON.stringify(categorys))
  for (let i = 0; i < cloneCategory.length; i++) {
    if (cloneCategory[i].parentid === parentid) {
      const item = cloneCategory[i]
      temp = formatCategory(cloneCategory, cloneCategory[i].id)
      if (temp.length > 0) {
        item.children = temp
      }
      tree.push(item)
    }
  }
  return tree
}

/**
 * 根据module获取对应类型的栏目树形结构数组
 * @param {Array} category 栏目数组
 * @param {Number(Int)} type 栏目模型
 * @returns {Array} 栏目树形结果数组
 */
export function getCategoryByType(categorys, type) {
  const columnEnum = ['', '', 'blog', 'image', 'bangumi']
  const findIndex = columnEnum.findIndex(item => item === type)
  const filterColumn = categorys.filter(item => item.type === findIndex)
  filterColumn.forEach(element => {
    element.value = element.id
    element.label = element.name
  })
  return formatCategory(filterColumn)
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
 * 睡眠等待
 * @param {Number} duration 等待时间
 */
export function sleep(duration = 10000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}

/**
 * 数字小数位数格式化
 * @param {Number} value 源数据
 * @param {Number [int]} length 保留小数位数
 */
export function fixedNumber(value, length = 2) {
  const isInteger = parseInt(value) === parseFloat(value)
  return value && !isInteger ? value.toFixed(length) : value
}

/**
 * 获取路径信息
 * @param {String} path 路径
 * @returns {Object} { dirname: 目录, basename: 文件名, filename: 文件名(不带后缀), extname: 文件后缀(带'.') }
 */
export function getPathName(path) {
  const pathSplit = path.split('/')
  const basename = pathSplit.pop()
  const fileSplit = basename.split('.')
  const [filename, extname] = fileSplit
  return {
    dirname: pathSplit.join('/'),
    basename: basename || '',
    filename: filename || '',
    extname: extname ? '.' + extname : ''
  }
}
