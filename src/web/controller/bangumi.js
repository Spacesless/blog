const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('bangumi')
  }

  async listAction() {
    const { id, page, sortBy, orderBy, status, progress, tags } = this.get()

    const configs = await this.getConfigs()
    const categorys = await this.getCategory()

    // 当前栏目
    const { category, seo } = this.getListInfo(id, categorys, configs)
    if (think.isEmpty(category)) {
      return this.ctx.throw(404)
    }

    // 当前列表
    const { list_bangumi: pageSize, thumb_bangumi_x, thumb_bangumi_y, thumb_kind } = configs
    const field = 'id,title,description,total,current,ratings,imgurl,showtime,status,tag'
    const sort = sortBy || 'updatetime'
    const order = orderBy ? orderBy.toUpperCase() : 'DESC'

    const where = { is_show: 1, is_recycle: 0 }
    const findCategory = await this.model('category').getChildrenCategory(categorys, category.id)
    where.category_id = ['IN', findCategory]
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
    if (tags) where.tag = ['like', tags.split(',').map(item => `%${item}%`)]

    const list = await this.modelInstance
      .where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect()

    // 裁剪图片
    for (const item of list.data) {
      const { imgurl, tag } = item
      item.imgurl = await this.thumbImage(imgurl, thumb_bangumi_x, thumb_bangumi_y, thumb_kind)
      item.tag = tag ? tag.split('|') : []
    }

    return this.success({
      seo,
      category,
      list
    })
  }

  async detailAction() {
    const { id } = this.get()
    if (!think.isInt(+id)) {
      return this.ctx.throw(404)
    }

    const data = await this.modelInstance
      .where({ id, is_recycle: 0 })
      .find()

    if (think.isEmpty(data)) {
      return this.ctx.throw(404)
    }

    const configs = await this.getConfigs()
    const categorys = await this.getCategory()

    data.players = data.players ? JSON.parse(data.players) : []
    const { category, seo } = this.getDetailInfo(data, categorys, configs)

    return this.success({
      seo,
      category,
      content: data
    })
  }
}
