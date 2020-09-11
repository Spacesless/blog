const Base = require('./base.js')

module.exports = class extends Base {
  async indexAction() {
    const classifyList = ['', 'tl_blog', 'tl_image', 'tl_bangumi']
    const { classify, keyword } = this.get()
    const field = 'id,title,content,updatetime,imgurl'
    let SQL
    let where = ''
    let list
    const className = classifyList[+classify]
    if (keyword) {
      where += `where ((title LIKE '%${keyword}%') OR (content LIKE '%${keyword}%'))`
      if (!think.isEmpty(className)) {
        const moduleList = ['', 'blog', 'image', 'bangumi']
        const moduleName = moduleList[+classify] || ''
        SQL = `
          SELECT ${field},'${moduleName}' as type FROM ${className} ${where}
        `
      } else {
        SQL = `
          SELECT ${field},'blog' as type FROM tl_blog ${where} UNION ALL
          SELECT ${field},'image' as type FROM tl_image ${where} UNION ALL
          SELECT ${field},'bangumi' as type FROM tl_bangumi ${where}
        `
      }

      const page = this.get('page') || 1
      const pageSize = 20
      const allData = await this.model('config').query(SQL)
      const count = allData.length

      let data = allData.sort((a, b) => {
        return new Date(b.updatetime) - new Date(a.updatetime)
      })
      data = data.slice((page - 1) * pageSize, page * pageSize)
      list = {
        pageSize,
        currentPage: +page,
        count,
        totalPages: Math.ceil(allData.length / pageSize),
        data
      }

      for (const element of list.data) {
        const { id, title, category_id, type, imgurl } = element
        let content = element.content
        const rows = this.category.find(item => item.id === category_id)

        const _title = title.indexOf(keyword) > -1 ? title.replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`) : title
        content = content.replace(/<.*?>/g, '')
        const keyIndex = content.indexOf(keyword)
        const start = keyIndex - 60 < 0 ? 0 : keyIndex - 60
        const _content = keyIndex > -1
          ? content.substr(start, 130).replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`)
          : content.substr(0, 130)

        let thumbX
        let thumbY
        switch (type) {
          case 'bangumi':
            thumbX = this.options.thumb_bangumi_x
            thumbY = this.options.thumb_bangumi_y
            break
          default:
            thumbX = this.options.thumb_blog_x
            thumbY = this.options.thumb_blog_y
        }

        const classList = this.category.filter(item => item.id === category_id).map(item => {
          return {
            name: item.name,
            url: `/${item.folderName}/${item.id}`
          }
        })

        Object.assign(element, {
          title: _title,
          content: _content,
          url: `/${rows.folderName}/content/${id}`,
          imgurl: await this.thumbImage(imgurl, thumbX, thumbY, this.options.thumb_kind),
          classList
        })
      }
    } else {
      list = []
    }

    return this.success(list)
  }
}
