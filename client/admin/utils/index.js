import { convertToTree } from '#/utils'

/**
 * 根据module获取对应类型的栏目树形结构数组
 * @param {Array} category 栏目数组
 * @param {Number(Int)} type 栏目模型
 * @returns {Array} 栏目树形结果数组
 */
export function getCategoryByType (categories, type) {
  const filterColumn = categories.filter(item => type ? item.type === type : true)
  filterColumn.forEach((element) => {
    element.value = element.id
    element.label = element.name
  })
  return convertToTree(filterColumn)
}

/**
 * 获取路径信息
 * @param {String} path 路径
 * @returns {Object} { dirname: 目录, basename: 文件名, filename: 文件名(不带后缀), extname: 文件后缀(带'.') }
 */
export function getPathName (path) {
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
