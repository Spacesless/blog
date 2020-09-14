const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('article')
  }

  async listAction() {
    const { id, page, sortBy, orderBy, tags } = this.get()

    const configs = await this.getConfigs()
    const categorys = await this.getCategory()

    // 当前栏目
    const { category, seo } = this.getListInfo(id, categorys, configs)
    if (think.isEmpty(category)) {
      return this.ctx.throw(404)
    }

    // 当前列表
    const { list_blog: pageSize, thumb_article_x, thumb_article_y, thumb_kind } = configs

    const field = 'id,title,description,imgurl,updatetime,hits,tag'
    const sort = sortBy || 'updatetime'
    const order = orderBy ? orderBy.toUpperCase() : 'DESC'

    const where = { is_show: 1, is_recycle: 0 }
    const findCategory = await this.model('category').getChildrenCategory(categorys, category.id)
    where.category_id = ['IN', findCategory]
    // tag标签
    if (tags) where.tag = ['like', tags.split(',').map(item => `%${item}%`)]

    const list = await this.modelInstance
      .where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect()

    for (const item of list.data) {
      const { imgurl, tag } = item
      item.imgurl = await this.thumbImage(imgurl, thumb_article_x, thumb_article_y, thumb_kind)
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

    const { category, seo } = this.getDetailInfo(data, categorys, configs)
    data.content = await this.compressContent(data.content)

    // 详情分页
    const field = 'id,title'
    const prev = await this.modelInstance
      .field(field)
      .where({ 'id': ['<', id], is_recycle: 0 })
      .limit(1)
      .find()
    const next = await this.modelInstance
      .field(field)
      .where({ 'id': ['>', id], is_recycle: 0 })
      .limit(1)
      .find()
    const page = [
      prev || {},
      next || {}
    ]
    page.forEach(item => {
      if (!think.isEmpty(item)) item.url = ''
    })

    return this.success({
      seo,
      category,
      content: data,
      page
    })
  }
}
