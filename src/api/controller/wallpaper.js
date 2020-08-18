const Base = require('./base.js')

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('image')
  }

  async listAction() {
    const { id, page, sortBy, orderBy, resolutions, resolutionBy, tags } = this.get()

    // 当前栏目
    const { column, seo } = this.getListInfo(id)
    if (think.isEmpty(column)) {
      return this.ctx.throw(404)
    }

    // 当前列表
    const { list_image: pageSize } = this.options
    const field = 'id,title,description,imgurl,updatetime,hits,imgwidth,imgheight,tag'
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
    // 分辨率
    if (!think.isEmpty(resolutions)) {
      const upperToArr = resolutions.split('x')
      const expectWidth = upperToArr[0] ? parseInt(upperToArr[0]) : null
      const expectHeight = upperToArr[1] ? parseInt(upperToArr[1]) : null
      const logic = resolutionBy === 'equal' ? '=' : '>='
      if (!think.isEmpty(expectWidth)) where.imgwidth = [logic, expectWidth]
      if (!think.isEmpty(expectHeight)) where.imgheight = [logic, expectHeight]
    }
    // tag标签
    if (tags) where.tag = ['like', tags.split()]
    const list = await this.modelInstance
      .where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect()

    const { thumb_image_x: imageX, thumb_image_y: imageY, thumb_kind: thumbKind } = this.options
    for (const item of list.data) {
      item.imgurl = await this.thumbImage(item.imgurl, imageX, imageY, thumbKind)
      item.tag = item.tag.split('|')
    }

    return this.success({
      seo,
      column,
      list
    })
  }

  async contentAction() {
    const { id, webp } = this.get()
    if (!think.isInt(+id)) {
      return this.ctx.throw(404)
    }

    const content = await this.modelInstance
      .where({ id, is_recycle: 0 })
      .find()

    if (think.isEmpty(content)) {
      return this.ctx.throw(404)
    }

    // 图片标题 添加图片尺寸
    const { imgwidth, imgheight } = content
    content.title = `${content.title} ${imgwidth}x${imgheight}`

    const { column, seo } = this.getDetailInfo(content)

    const { thumb_kind: thumbKind } = this.options
    content.preview = await this.thumbImage(content.imgurl, 1280, 720, thumbKind, { isConvert: webp })

    return this.success({
      seo,
      column,
      content
    })
  }
}
