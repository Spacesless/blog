const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('toolkit')
  }

  async listAction() {
    const categorys = await this.getCategory()

    // 当前栏目
    const path = this.ctx.path
    const findCategory = categorys.find(item => item.level === 1 && path.includes(item.folder_name))

    if (!findCategory) {
      return this.ctx.throw(404)
    }

    // meta信息
    const configs = await this.getConfigs()
    const { seo } = this.getListInfo(findCategory.id, categorys, configs)

    // webapp列表
    const list = await this.model('category')
      .where({ is_show: 1 })
      .join({
        table: 'toolkit',
        join: 'inner', // join 方式，有 left, right, inner 3 种方式
        on: ['id', 'category_id'] // ON 条件
      }).select()
    const webapps = this.model('category').formatCategoryUrl(list)

    return this.success({
      seo,
      list: webapps
    })
  }

  async contentAction() {
    const { path } = this.get()

    const categorys = await this.getCategory()

    const findCategory = categorys.find(item => item.filename === path)

    if (!findCategory) {
      return this.ctx.throw(404)
    }

    const configs = await this.getConfigs()
    const { seo } = this.getListInfo(findCategory.id, categorys, configs)

    const data = await this.modelInstance
      .where({ id: findCategory.id })
      .select()

    return this.success({
      seo,
      data
    })
  }
}