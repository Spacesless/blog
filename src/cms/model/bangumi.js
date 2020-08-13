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

  async updateContent(_id, data, siteurl = '') {
    const { imgurl, players, content } = data
    if (imgurl) data.imgurl = imgurl.replace(siteurl, '')
    if (players) data.players = JSON.stringify(players)
    if (content) data.content = content.replace(new RegExp(siteurl + '/upload', 'gi'), '/upload')
    const result = await this.where({ id: _id }).update(data)
    return result
  }

  async foreverDelete(_id) {
    // 删除上传的图片
    const row = await this.where({ id: _id }).find()
    if (think.isEmpty(row)) return {}
    const content = row.content.match(/<img[^>]+>/g) || []
    const contentImg = []
    content.forEach(item => {
      item.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        contentImg.push(capture)
      })
    })
    const imgurls = [row.imgurl, ...contentImg]
    await think.removeFile(imgurls)
    // // 删除数据
    const result = await this.where({ id: _id }).delete()
    return result
  }
}
