// import parseTime and set to filter
export { parseTime, getAbsolutePath } from '#/utils'

/**
 * 计算tag的classname
 * @param {String} tag 标签名称
 * @returns {String}
 * @summary 标签charCodeAt总长度%颜色总数
 */
export function tagClassName(tag) {
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
 * 获取图片的srcset属性
 * @param {String} imgurl 1倍图地址
 * @param {String} sImgurl 0.5倍图地址
 * @param {Number} width 1倍图宽度
 * @returns {String}
 */
export function getImageSrcSet({ imgurl, sImgurl, width }) {
  let result = ''
  if (imgurl && width) result += `${imgurl} ${width}w`
  if (sImgurl && width) result += `, ${sImgurl} ${width / 2}w`
  return result
}
