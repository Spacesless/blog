module.exports = class extends think.Controller {
  constructor(...arg) {
    super(...arg)
    this.siteurl = ''
    this.title = ''
    this.options = null
    this.category = null
  }

  async __before() {
    // 配置信息
    this.siteurl = this.ctx.origin.replace(/http:|https:/, '')
    this.options = await this.model('config').getConfig()

    // SEO
    switch (this.options.seo_title_type) {
      case '1':
        this.title = ''
        break
      case '2':
        this.title = ` - ${this.options.keywords}`
        break
      case '3':
        this.title = ` - ${this.options.sitename}`
        break
      case '4':
        this.title = ` - ${this.options.keywords} | ${this.options.sitename}`
        break
    }

    // 主导航信息
    const allColumns = await this.model('column').getCategory()
    this.category = this.formatNavigation(allColumns)
  }

  formatNavigation(category) {
    category.forEach(item => {
      const { id, folderName, filename, level, type } = item
      let path = ''
      if (think.isEmpty(filename)) {
        switch (type) {
          case 5:
            path = level === 1 ? '' : id
            break
          case 7:
            path = ''
            break
          default:
            path = level === 1 ? '' : id
        }
      } else {
        path = `${filename}`
      }
      item.url = `/${folderName}/${path}`
    })
    return category
  }

  __cell() {
    return this.ctx.throw(404)
  }
}
