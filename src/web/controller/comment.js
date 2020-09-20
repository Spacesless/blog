const Base = require('./base.js')

module.exports = class extends Base {
  async indexAction() {
    const { id, page, pageSize } = this.get()
    // 查询主评论
    // const field = ''
    const list = await this.model('comment')
      // .field(field)
      .where({ topic_id: id, type: 1 })
      .page(page, pageSize)
      .select()
    // 查询回复
    const parentIds = list.map(item => item.id)
    const replyList = await this.model('comment')
      // .field(field)
      .where({
        reply_id: ['IN', parentIds]
      })
      .select()

    const allComment = [...list, ...replyList]
    const treeData = this.convertToTree(allComment, 'reply_id')

    return this.success({
      total: allComment.length,
      data: treeData
    })
  }

  async postAction() {
    let result
    const data = this.post()

    const isExist = await this.model('message')
      .where({ ip: this.ctx.ip, content: ['like', `%${data.content}%`] })
      .count()
    if (isExist) {
      return this.fail('请勿重复评论')
    } else {
      data.addtime = new Date()
      result = await this.model('comment')
        .add(data)
    }

    if (result) return this.success()
    else return this.fail()
  }
}
