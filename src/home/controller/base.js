module.exports = class extends think.Controller {
  constructor(...arg) {
    super(...arg)
    this.siteurl = ''
  }

  async __before() {
    // 配置信息
    this.siteurl = this.ctx.origin.replace(/http:|https:/, '')
  }

  /**
   * 获取导航菜单数据
   * @returns {Array}
   */
  async getCategory() {
    let categorys = await this.model('category').getCategory()
    categorys = this.formatCategoryUrl(categorys)
    return categorys
  }

  /**
   * 格式化导航菜单地址
   * @param {Array} categorys
   */
  formatCategoryUrl(categorys) {
    categorys.forEach(item => {
      const { id, folder_name, filename, level, type } = item
      let path = ''
      if (think.isEmpty(filename)) {
        switch (type) {
          case 'other':
            path = ''
            break
          case 'toolkit':
            path = ''
            break
          default:
            path = level === 1 ? '' : id
        }
      } else {
        path = `${filename}`
      }
      item.url = `/${folder_name}/${path}`
    })
    return categorys
  }

  __cell() {
    return this.ctx.throw(404)
  }
}
