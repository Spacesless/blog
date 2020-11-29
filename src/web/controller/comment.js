const Base = require('./base.js')
const moment = require('moment')

module.exports = class extends Base {
  async indexAction() {
    const { topic_id, page, pageSize } = this.get()
    // 查询主评论
    const field = 'id,topic_id,parent_id,reply_name,type,name,email,website,content,addtime,is_admin'
    const list = await this.model('comment')
      .field(field)
      .where({ topic_id: topic_id, type: 1, is_show: 1 })
      .order('addtime DESC')
      .page(page, pageSize)
      .select()
    // 查询回复
    const parentIds = list.map(item => item.id)
    let replyList = []
    if (parentIds.length) {
      replyList = await this.model('comment')
        .field(field)
        .where({
          is_show: 1,
          parent_id: ['IN', parentIds]
        })
        .order('addtime DESC')
        .select()
    }

    const allComment = [...list, ...replyList]
    const treeData = this.convertToTree(allComment)

    return this.success({
      total: allComment.length,
      data: treeData
    })
  }

  async postAction() {
    let IP = this.ctx.ip
    IP = IP.indexOf('::ffff:') !== -1 ? IP.substring(7) : IP

    let result
    const data = this.post()

    const isExist = await this.model('comment')
      .where({ ip: IP, parent_id: data.parent_id, content: ['like', `%${data.content}%`] })
      .count()
    if (isExist) {
      return this.fail('请勿重复评论')
    } else {
      data.addtime = moment().format('YYYY-MM-DD HH:mm:ss')
      data.ip = IP
      result = await this.model('comment')
        .add(data)
    }

    if (result) return this.success()
    else return this.fail('哎呀，遇到一个无法解决的问题呢')
  }
}
