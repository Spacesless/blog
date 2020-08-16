const Base = require('./base.js')

module.exports = class extends Base {
  async indexAction() {
    const { title, keywords, description } = this.options
    const seo = {
      title,
      keywords,
      description
    }

    // 正在做 banner
    const bannerField = 'id,imgurl,title,description'
    const banners = await this.model('banner')
      .field(bannerField)
      .where({ isShow: 1 })
      .order('sort ASC')
      .select()
    for (const element of banners) {
      element.imgurl = await this.convertToWebp(element.imgurl)
    }

    // 最新动态文章
    const blogField = 'id,class1,class2,class3,imgurl,title,description,hits,updatetime'
    const blogWhere = { is_show: 1 }
    const blogs = await this.model('blog')
      .field(blogField)
      .where(blogWhere)
      .limit(10)
      .order('updatetime DESC')
      .select()

    for (const element of blogs) {
      const { class1, class2, class3, description } = element
      element.description = this.substr(description, 0, 80)
      const currentClass = class3 || class2 || class1
      const currentColumn = this.columns.find(item => item.id === currentClass)
      const folder = currentColumn ? currentColumn.folderName : 'blog'
      element.column = {
        name: currentColumn.name,
        url: `/${folder}/${currentColumn.id}`
      }
    }

    // 最新追番
    const bangumiField = 'id,class1,title,description,total,current,imgurl,showtime,status'
    const bangumiWhere = { is_show: 1, current: ['EXP', '< `total`'] }
    const bangumis = await this.model('bangumi')
      .field(bangumiField)
      .where(bangumiWhere)
      .limit(6)
      .order('updatetime DESC')
      .select()

    const { thumb_bangumi_x: bangumiX, thumb_bangumi_y: bangumiY, thumb_kind: thumbKind } = this.options
    for (const element of bangumis) {
      element.description = this.substr(element.description, 0, 60)
      element.imgurl = await this.thumbImage(element.imgurl, bangumiX, bangumiY, thumbKind)
    }

    return this.success({
      seo,
      banners,
      blogs,
      bangumis
    })
  }
}
