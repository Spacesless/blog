const Base = require('./base.js')

module.exports = class extends Base {
  async addContent(data, siteurl = '') {
    const { imgurl, players, content } = data
    if (imgurl) data.imgurl = imgurl.replace(siteurl, '')
    if (players) data.players = JSON.stringify(players)
    if (content) data.content = content && content.replace(new RegExp(siteurl + '/upload', 'gi'), '/upload')
    const insertId = await this.add(data)
    return insertId
  }

  async updateContent(id, data, siteurl = '') {
    const { imgurl, players, content } = data
    if (imgurl) data.imgurl = imgurl.replace(siteurl, '')
    if (players) data.players = JSON.stringify(players)
    if (content) data.content = content.replace(new RegExp(siteurl + '/upload', 'gi'), '/upload')
    const result = await this.where({ id }).update(data)
    return result
  }

  async foreverDelete(id) {
    const row = await this.where({ id }).find()
    if (think.isEmpty(row)) return {}
    // // 删除数据
    const result = await this.where({ id }).delete()
    return result
  }
}
