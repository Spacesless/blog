const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('tool')
  }

  async listAction() {
    // 当前栏目
    const path = this.ctx.path
    const rows = this.columns.find(item => item.classtype === 1 && path.indexOf(item.folderName) > -1)

    if (!rows) {
      return this.ctx.throw(404)
    }

    // meta信息
    const { name: title, keywords, description } = rows
    const seo = {
      title: title + this.title,
      keywords,
      description
    }

    // webapp列表
    const list = await this.model('column')
      .where({ is_show: 1 })
      .join({
        table: 'tool',
        join: 'inner', // join 方式，有 left, right, inner 3 种方式
        on: ['id', 'column_id'] // ON 条件
      }).select()
    list.forEach(item => {
      const { column_id: columnId, folder_name: folderName } = item
      item.id = columnId
      item.folderName = folderName
    })
    const webapps = this.formatNavigation(list)

    return this.success({
      seo,
      list: webapps
    })
  }

  async contentAction() {
    const { id } = this.get()
    const rows = this.columns.find(item => item.id === +id || item.filename === +id)

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
