const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('blog')
  }

  async listAction() {
    const { id, page, sortBy, orderBy, tags } = this.get()

    // 当前栏目
    const { column, seo } = this.getListInfo(id)
    if (think.isEmpty(column)) {
      return this.ctx.throw(404)
    }

    // 当前列表
    const { list_blog: pageSize } = this.options
    const field = 'id,title,description,imgurl,updatetime,hits,tag'
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
    // tag标签
    if (tags) where.tag = ['like', tags.split(',').map(item => `%${item}%`)]
    const list = await this.modelInstance
      .where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect()

    const { thumb_blog_x: blogX, thumb_blog_y: blogY, thumb_kind: thumbKind } = this.options
    for (const item of list.data) {
      const { imgurl, tag } = item
      item.imgurl = await this.thumbImage(imgurl, blogX, blogY, thumbKind)
      item.tag = tag ? tag.split('|') : []
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

    const { column, seo } = this.getDetailInfo(content)
    content.content = await this.compressContent(content.content)

    // 面包屑导航信息
    const subNavigation = this.findAllParent(column.id)
    this.assign('subnav', subNavigation)

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
      column,
      content,
      page
    })
  }

  async sameAction() {
    // const { id } = this.get()
    // const { column } = this.getList(id)
    // const { class1, class2, class3, classtype } = column
    const field = 'id,title,description,total,current,ratings,imgurl,showtime,status'
    const where = { is_show: 1, is_recycle: 0 }
    const list = await this.modelInstance
      .where(where)
      .field(field)
      .select()

    return this.success(list)
  }
}
