const Base = require('./base.js')

module.exports = class extends Base {
  async addContent(data, siteurl) {
    const { imgurl, content } = data
    if (imgurl) data.imgurl = imgurl.replace(siteurl, '')
    if (content) data.content = content.replace(new RegExp(siteurl, 'gi'), '')
    const insertId = await this.add(data)
    return insertId
  }

  async updateContent(id, data, siteurl) {
    const { imgurl, content } = data
    if (imgurl) data.imgurl = imgurl.replace(siteurl, '')
    if (content) data.content = content.replace(new RegExp(siteurl, 'gi'), '')
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
