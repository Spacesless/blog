const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('toolkit')
  }

  async listAction() {
    await this.getConfigs()
    await this.getCategory()
    // 当前栏目
    const path = this.ctx.path
    const findCategory = this.category.find(item => item.level === 1 && path.includes(item.folder_name))
    console.log(findCategory)

    if (!findCategory) {
      return this.ctx.throw(404)
    }

    // meta信息
    const { name: title, keywords, description } = findCategory
    const seo = {
      title: title + this.title,
      keywords,
      description
    }

    // webapp列表
    const list = await this.model('category')
      .where({ is_show: 1 })
      .join({
        table: 'toolkit',
        join: 'inner', // join 方式，有 left, right, inner 3 种方式
        on: ['id', 'category_id'] // ON 条件
      }).select()
    list.forEach(item => {
      const { category_id, folder_name } = item
      item.id = category_id
      item.folderName = folder_name
    })
    const webapps = this.formatNavigation(list)

    return this.success({
      seo,
      list: webapps
    })
  }

  async contentAction() {
    const { id } = this.get()
    const rows = this.category.find(item => item.id === +id || item.filename === +id)

    if (!rows) {
      return this.ctx.throw(404)
    }

    const { name: title, keywords, description } = rows
    const seo = {
      title: title + this.title,
      keywords,
      description
    }

    const data = await this.modelInstance
      .where({ id })
      .select()

    return this.success({
      seo,
      data
    })
  }
}
