const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('bangumi')
  }

  async listAction() {
    const { id, page, sortBy, orderBy, status, progress, tags } = this.get()

    // 当前栏目
    const { column, seo } = this.getListInfo(id)
    if (think.isEmpty(column)) {
      return this.ctx.throw(404)
    }

    // 当前列表
    const { list_bangumi: pageSize } = this.options
    const field = 'id,title,description,total,current,ratings,imgurl,showtime,status,tag'
    const sort = sortBy || 'updatetime'
    const order = orderBy ? orderBy.toUpperCase() : 'DESC'
    const where = { is_show: 1, is_recycle: 0 }
    switch (column.classtype) {
      case 2:
        where.class2 = column.id
        break
      case 3:
        where.class3 = column.id
        break
      default:
        where.class1 = column.id
    }
    // 番剧状态
    if (status) where.status = status
    // 追剧进度
    switch (progress) {
      case '0':
        where.current = ['EXP', '< `total`']
        break
      case '1':
        where.current = ['EXP', '= `total`']
        break
    }
    // tag标签
    if (tags) where.tag = ['like', tags.split()]
    const list = await this.modelInstance
      .where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect()

    // 裁剪图片
    const { thumb_bangumi_x: bangumiX, thumb_bangumi_y: bangumiY, thumb_kind: thumbKind } = this.options
    for (const item of list.data) {
      item.imgurl = await this.thumbImage(item.imgurl, bangumiX, bangumiY, thumbKind)
      item.tag = item.tag.split('|')
    }

    return this.success({
      seo,
      column,
      list
    })
  }

  async contentAction() {
    const { id } = this.get()
    if (!think.isInt(+id)) {
      return this.ctx.throw(404)
    }

    const content = await this.modelInstance
      .where({ id, is_recycle: 0 })
      .find()

    if (think.isEmpty(content)) {
      return this.ctx.throw(404)
    }

    content.players = content.players ? JSON.parse(content.players) : []
    const { column, seo } = this.getDetailInfo(content)

    return this.success({
      seo,
      column,
      content
    })
  }
}
