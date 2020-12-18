const Base = require('./base.js')

module.exports = class extends Base {
  async indexAction() {
    const mysql = await this.model('config').query('SELECT VERSION() as version')
    const data = {
      nodeVersion: process.versions.node,
      v8Version: process.versions.v8,
      platform: process.platform,
      thinkjsVersion: think.version,
      mysqlVersion: mysql[0].version
    }

    return this.success({
      version: data,
      count: {
        category: await this.model('category').count('id'),
        article: await this.model('article').count('id'),
        bangumi: await this.model('bangumi').count('id'),
        comment: await this.model('comment').count('id')
      }
    })
  }

  // 查询未查看的评论
  async commentAction() {
    const field = 'id,content,addtime,status'
    const list = await this.modelInstance
      .field(field)
      .where({ status: 0 })
      .order('addtime DESC')
      .page(1, 8)
      .countSelect()
    return this.success(list)
  }

  // 清除缓存
  async refreshAction() {
    await think.cache('category', null)
    await think.cache('config', null)
  }
}
