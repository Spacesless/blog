const { parse } = require('url')
const path = require('path')
const axios = require('axios')

// 允许下载文件格式
const ALLOW_EXTS = [
  /** 图片文件 */
  /\.(gif|jpe?g|png|webp|tiff|bmp|ico)$/i,
  /** 多媒体文件 */
  /\.(mp3|wmv|mp4|avi|flv)$/i,
  /** 常用档案文件 */
  /\.(txt|xml|json|docx?|xlsx?|pptx?)$/i,
  /\.(zip|rar|pdf|gz)$/i
]
// 允许下载缩略图尺寸
const ALLOW_SIZES = [
  '1920x1080',
  '1920x1200',
  '3840x2160',
  '5120x2880',
  '7680x4320'
]

module.exports = class extends think.Controller {
  async indexAction() {
    const { file, filename } = this.get()
    const { protocol } = parse(file)
    /** 检查文件类型 */
    const ext = this.extWhiteList(file)
    if (!ext) {
      return this.fail('FILE_FORMAT_NOT_ALLOWED')
    }

    const formatName = filename ? `${filename}${path.extname(file)}` : ''
    if (protocol && protocol.indexOf('http') > -1) {
      return this.downloadRemote(file, formatName)
    } else {
      return this.downloadLocal(file, formatName)
    }
  }

  /**
   * 下载本地文件
   * @param {String} file 文件地址
   * @param {String} filename 下载文件命名
   */
  async downloadLocal(file, filename) {
    const filePath = path.join(think.RESOURCE_PATH, file)
    if (think.isExist(filePath)) {
      return this.download(filePath, filename)
    } else {
      const isThumb = file.includes('/thumb')
      if (isThumb) {
        const ext = path.extname(filePath)
        const basename = path.basename(filePath, ext)
        const sizes = basename.split('-')[1] || ''
        if (!ALLOW_SIZES.some(item => item === sizes)) return this.fail(403, 'FORBIDDEN, THIS SIZE IS NOT IN THE ALLOWED LIST, EXPECT ' + ALLOW_SIZES)
        const sizesArr = sizes.split('x')
        if (sizesArr.length !== 2) return this.fail('NOT_FOUND')
        const width = sizesArr[0]
        const height = sizesArr[1]
        const src = file.replace(/\/thumb|-.*/g, '') + ext
        const result = await think.sharpResize(
          src, file,
          {
            width: +width,
            height: +height,
            fit: 0
          }
        )
        if (result) return this.download(filePath, filename)
      }
      return this.fail('NOT_FOUND')
    }
  }

  async downloadRemote(url, filename) {
    const res = await axios({
      url,
      responseType: 'arraybuffer'
    }).catch(() => {
      throw new Error('NOT_FOUND')
    })

    if (res && res.headers['content-type'].indexOf('image') === -1) {
      this.fail('NOU_ALLOWS')
    }

    this.ctx.set('Content-Disposition', `attachment; filename=${filename || path.basename(url)}`)
    this.body = res.data
  }

  // MIME过滤
  extWhiteList(filename) {
    return ALLOW_EXTS.some(reg => reg.test(filename))
  }
}
