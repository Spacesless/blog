const Base = require('./base.js')

module.exports = class extends Base {
  async getListAction() {
    const field = 'id,title,category_id,updatetime'
    const type = this.get('type')
    const articleList = type && type !== 'article' ? [] : await this.model('article')
      .field(`${field},'article' as type`)
      .where({ is_recycle: 1 })
      .select()
    const bangumiList = type && type !== 'bangumi' ? [] : await this.model('bangumi')
      .field(`${field},'bangumi' as type`)
      .where({ is_recycle: 1 })
      .select()
    const totalList = [...articleList, ...bangumiList]
    const page = this.get('page') ? this.get('page') : 1
    const pageSize = this.get('pagesize') ? this.get('pagesize') : 20
    const result = totalList.slice((page - 1) * pageSize, page * pageSize)
    result.sort((a, b) => {
      return b.updatetime - a.updatetime
    })
    return this.success({
      count: totalList.length,
      page: page,
      data: result
    })
  }

  async deleteAction() {
    const list = this.post('list')
    const promises = []
    list.forEach(item => {
      const { id, type } = item
      const step = this.model(type).deleteForever(id)
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
      const { id, type } = item
      const step = this.model(type).where({ id }).update({
        updatetime: new Date(),
        is_recycle: 0
      })
      promises.push(step)
    })

    let rows
    await Promise.all(promises).then(result => {
      rows = [...result]
    })
    return this.success(rows)
  }
}
