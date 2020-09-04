const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const Base = require('./base')
const readdirSync = think.promisify(fs.readdir, fs)

module.exports = class extends Base {
  /**
   * @param {String} siteurl 网站地址
   */
  constructor(siteurl) {
    super()
    this.siteurl = siteurl
  }
  /**
   * 文件
   * @param {Object} file
   */
  async upload(file) {
    const ext = /^\.\w+$/.test(path.extname(file.path)) ? path.extname(file.path) : '.png'
    // 文件命名16位MD5后的通用唯一识别码(think.md5是32位~太长)
    let basename = think.md5(think.uuid('v4')).substr(0, 16) + ext
    // 过滤 ../../
    basename = basename.replace(/[\\/]/g, '')

    const destDir = this.getYearMonth()
    const destPath = path.join(think.UPLOAD_PATH, destDir)
    await fs.ensureDir(destPath) // 如果目录结构不存在，则创建它，如果目录存在，则不进行创建

    try {
      // 上传文件路径
      const filepath = path.join(destPath, basename)
      await fs.move(file.path, filepath, { overwrite: true })
      return {
        name: basename,
        url: url.resolve(this.siteurl, filepath.replace(think.UPLOAD_PATH, '/upload'))
      }
    } catch (e) {
      console.error(e)
      throw Error('FILE_UPLOAD_MOVE_ERROR')
    }
  }

  /**
   * 获取文件列表
   * @param {String} src 目标路径
   * @param {Number} page 当前页
   * @param {Number} pageSize 每页个数
   * @param {String} keyword 搜索关键词
   */
  async getFileList(src = 'upload/', page = 1, pageSize = 20, keyword) {
    const targetPath = path.join(think.RESOURCE_PATH, src)
    if (think.isDirectory(targetPath)) {
      const filesAndDirs = await readdirSync(targetPath)
      let list = []
      for (const item of filesAndDirs) {
        const itempath = path.join(targetPath, item)
        if (think.isDirectory(itempath)) {
          list.push({
            name: item,
            url: url.resolve('', itempath.replace(think.RESOURCE_PATH, '')),
            type: 1 // 目录
          })
        } else {
          const { size, mtime } = await fs.stat(itempath).catch(() => {
            return {
              size: 0,
              mtime: ''
            }
          })
          const extname = path.extname(item).replace('.', '')
          list.push({
            name: item,
            url: url.resolve(this.siteurl, itempath.replace(think.RESOURCE_PATH, '')),
            type: /(gif|jpe?g|png|webp|tiff|bmp|ico)$/i.test(extname) ? 2 : 3,
            extname,
            size,
            mtime
          })
        }
      }
      if (keyword) list = list.filter(item => item.name.includes(keyword))
      // 目录排前面
      list.sort((a, b) => {
        if (a.type === b.type) return a.name - b.name
        return a.type - b.type
      })
      list = list.slice((page - 1) * pageSize, page * pageSize)
      return {
        count: keyword ? list.length : filesAndDirs.length,
        page: page,
        data: list
      }
    }
  }
}
