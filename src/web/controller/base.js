const isDev = think.env === 'development'

module.exports = class extends think.Controller {
  constructor(...arg) {
    super(...arg)
    this.siteurl = ''
  }

  __before() {
    // 配置信息
    this.siteurl = this.ctx.origin.replace(/http:|https:/, '')
  }

  /**
   * 获取系统配置
   * @returns {Object}
   */
  async getConfigs() {
    const configs = await this.model('config').getConfig()
    return configs
  }

  /**
   * 获取导航菜单数据
   * @returns {Array}
   */
  async getCategory() {
    let categorys = await this.model('category').getCategory()
    categorys = this.model('category').formatCategoryUrl(categorys)
    return categorys
  }

  /**
   * 二维数组转树形数组
   * @param {Array} data 原二维数组
   * @param {Number} parent_id 父节点id
   * @returns {Array} 树形数组 [{id:1,children:[{id:2},{id:3,children:[{id:4}]}]}]
   */
  convertToTree(data, key = 'parent_id', value = 0) {
    const tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item[key] === value) {
        temp = this.convertToTree(data, key, item.id)
        if (temp.length > 0) {
          item.children = temp
        }
        tree.push(item)
      }
    }
    return tree
  }

  /**
   * 设置列表页公共信息
   * @param {Number} id 期望栏目id
   */
  getListInfo(id, categorys, configs) {
    let findCategory
    // 当前栏目
    if (think.isEmpty(id)) {
      const path = this.ctx.path
      findCategory = categorys.find(item => item.level === 1 && path.includes(item.folder_name))
    } else {
      findCategory = categorys.find(item => item.id === +id)
    }

    if (!findCategory) {
      return null
    }

    // meta信息
    const { name: title, keywords, description } = findCategory
    const seo = {
      title: `${title} -  ${configs.sitename}`,
      keywords,
      description
    }

    return {
      category: findCategory,
      seo
    }
  }

  /**
   * 获取详情的栏目以及seo信息
   * @param {Object} data 详情
   */
  getDetailInfo(data, categorys, configs) {
    const { title, keywords, description, category_id } = data

    // meta信息
    const findCategory = categorys.find(item => item.id === category_id)
    const { name: categoryTitle, keywords: categoryKeywords, description: categoryDescription } = findCategory

    const seo = {
      title: `${title} - ${categoryTitle} - ${configs.sitename}`,
      keywords: keywords || categoryKeywords,
      description: description || categoryDescription
    }

    return {
      category: findCategory,
      seo
    }
  }

  /**
   * 裁剪图片
   * @param {Number} width 目标图片宽度.
   * @param {Number} height 目标图片高度
   * @param {Number} fit 裁剪方式
   * @param {Object} options 目标图片输出参数
   */
  async thumbImage(src, width, height, fit = 0, options = {}) {
    if (think.isEmpty(src)) {
      src = '/static/placeholder.png'
    }
    const isSupportWebp = Number(this.ctx.headers.SupportWebp)
    const dest = await think.sharpResize(src, {
      width: +width,
      height: +height,
      fit: +fit
    },
    {
      format: isSupportWebp ? 'webp' : 'jpg',
      ...options
    })

    return isDev ? dest : `${dest ? '//cdn.timelessq.com' + dest : ''}`
  }

  /**
   * 转换图片为webp
   * @param {String} src
   */
  async convertToWebp(src) {
    if (think.isEmpty(src)) return ''

    const isSupportWebp = this.ctx.headers.supportwebp
    const dest = await think.sharpFormat(src, {
      format: +isSupportWebp ? 'webp' : 'jpg'
    })

    return isDev ? dest : `${dest ? '//cdn.timelessq.com' + dest : ''}`
  }

  /**
   * 文章内图片转换成webp格式
   * @param {String} str 文章内容
   * @returns {String}
   */
  async compressContent(content) {
    const isSupportWebp = this.ctx.headers.supportwebp
    if (+isSupportWebp) {
      const contentImages = content.match(/<img[^>]+>/g) || []
      const temp = []
      contentImages.forEach((item) => {
        item.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
          if (capture.includes('upload')) { temp.push(capture) }
        })
      })
      for (let i = 0; i < temp.length; i++) {
        const src = temp[i]
        if (think.isEmpty(src)) continue

        const dest = await think.sharpFormat(src, {
          format: +isSupportWebp ? 'webp' : 'jpg'
        })
        const fileUrl = isDev ? dest : `${dest ? '//cdn.timelessq.com' + dest : ''}`
        if (dest) { content = content.replace(src, fileUrl) }
      }
    }

    return content
  }

  /**
   * 截取字符串
   * @param {Number [int]} index 开始下标
   * @param {Number [int]} length 截取长度
   */
  substr(str, index, length) {
    return str.substr(index, length)
  }

  __cell() {
    return this.ctx.throw(404)
  }
}
