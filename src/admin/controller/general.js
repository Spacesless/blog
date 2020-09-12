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
        column: await this.model('category').count('id'),
        article: await this.model('article').count('id'),
        bangumi: await this.model('bangumi').count('id'),
        comment: await this.model('comment').count('id')
      }
    })
  }

  async refreshAction() {
    await think.cache('category', null)
    await think.cache('config', null)
  }
}
