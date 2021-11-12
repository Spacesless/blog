/**
 * 栏目数组转换成树形结构
 * @param {Array} category 栏目数组
 * @returns {Array} 栏目树形结果数组
 */
export function formatCategory(categorys, parent_id = 0) {
  const tree = []
  let temp
  const cloneCategory = JSON.parse(JSON.stringify(categorys))
  for (let i = 0; i < cloneCategory.length; i++) {
    if (cloneCategory[i].parent_id === parent_id) {
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
  const filterColumn = categorys.filter(item => type ? item.type === type : true)
  filterColumn.forEach(element => {
    element.value = element.id
    element.label = element.name
  })
  return formatCategory(filterColumn)
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
