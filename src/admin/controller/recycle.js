const Base = require('./base.js')

module.exports = class extends Base {
  async getListAction() {
    const field = 'id,title,category_id,updatetime'
    const type = +this.get('type')
    const blog = type && type !== 'blog' ? [] : await this.model('blog')
      .field(`${field},'blog' as type`)
      .where({ is_recycle: 1 })
      .select()
    const bangumi = type && type !== 'bangumi' ? [] : await this.model('bangumi')
      .field(`${field},'bangumi' as type`)
      .where({ is_recycle: 1 })
      .select()
    const list = [...blog, ...bangumi]
    const page = this.get('page') ? this.get('page') : 1
    const pageSize = this.get('pagesize') ? this.get('pagesize') : 20
    const result = list.slice((page - 1) * pageSize, page * pageSize)
    result.sort((a, b) => {
      return b.updatetime - a.updatetime
    })
    return this.success({
      count: list.length,
      page: page,
      data: result
    })
  }

  async deleteAction() {
    const list = this.post('list')
    const promises = []
    list.forEach(item => {
      const id = item.id
      const type = item.type
      const step = this.model(type).foreverDelete(id)
      promises.push(step)
    })

    let rows
    await Promise.all(promises).then(result => {
      rows = [...result]
    })
    return this.success(rows)
  }

  async restoreAction() {
    const list = this.post('list')
    const promises = []
    list.forEach(item => {
      const id = item.id
      const type = item.type
      const step = this.model(type).where({ id }).update({ is_recycle: 0 })
      promises.push(step)
    })

    let rows
    await Promise.all(promises).then(result => {
      rows = [...result]
    })
    return this.success(rows)
  }
}
