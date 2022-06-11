// import parseTime and set to filter
export { parseTime, getAbsolutePath } from '#/utils'

/**
 * 计算tag的classname
 * @param {String} tag 标签名称
 * @returns {String}
 * @summary 标签charCodeAt总长度%颜色总数
 */
export function tagClassName (tag) {
  const nameEnum = ['red', 'geekblue', 'orange', 'cyan', 'green', 'blue', 'purple', 'magenta']
  const enumLength = nameEnum.length
  let tagLength = 0
  for (let i = 0; i < tag.length; i++) {
    const charCode = tag.charCodeAt(i)
    tagLength += charCode
  }
  const findName = nameEnum[tagLength % enumLength]
  return findName ? `tl-tag--${findName}` : ''
}

/**
 * 格式化番剧状态
 * @param {Number} status
 * @returns {String}
 */
export function bangumiStatus (status) {
  status = status || 0
  const statusList = ['未上映', '连载中', '已完结']
  return statusList[status]
}

/**
 * 获取图片的srcset属性
 * @param {String} src 图片地址
 * @param {Number} width 图片宽度
 * @returns {String}
 */
export function getImageSrcSet (src, width) {
  let result = ''
  if (src && width) {
    result = `${src} ${width}w, ${src}?imageMogr2/thumbnail/!50p ${width / 2}w`
  }
  return result
}
