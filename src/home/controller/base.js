module.exports = class extends think.Controller {
  constructor(...arg) {
    super(...arg)
    this.siteurl = ''
    this.title = ''
    this.options = null
    this.columns = null
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
    const allColumns = await this.model('column').getColumn()
    this.columns = this.formatNavigation(allColumns)
  }

  formatNavigation(columns) {
    columns.forEach(item => {
      const { id, folderName, filename, classtype, module: _module } = item
      let path = ''
      if (think.isEmpty(filename)) {
        switch (_module) {
          case 5:
            path = classtype === 1 ? '' : id
            break
          case 7:
            path = ''
            break
          default:
            path = classtype === 1 ? '' : id
        }
      } else {
        path = `${filename}`
      }
      item.url = `/${folderName}/${path}`
    })
    return columns
  }

  __cell() {
    return this.ctx.throw(404)
  }
}
