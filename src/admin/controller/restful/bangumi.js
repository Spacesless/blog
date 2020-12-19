const Rest = require('../rest')

module.exports = class extends Rest {
  async getAction() {
    if (this.id) { // 番剧详情
      const data = await this.modelInstance.where({ id: this.id }).find()
      data.imgurl = data.imgurl ? this.siteurl + data.imgurl : ''
      data.content = data.content.replace(/upload/gi, this.siteurl + '/upload')
      return this.success(data)
    } else { // 番剧列表
      const { keyword, category, page, pageSize } = this.get()

      const where = { is_recycle: 0 }
      if (keyword) {
        where.title = ['like', `%${keyword}%`]
      }
      if (category) {
        const categorys = await this.model('category').getCategory()
        const categoryId = parseInt(category)
        const findCategory = await this.model('category', {}, 'common').getChildrenCategory(categorys, categoryId)
        where.category_id = ['IN', findCategory]
      }

      const field = 'id,title,imgurl,total,current,status,ratings,is_show'
      const list = await this.modelInstance.where(where)
        .field(field)
        .order('updatetime DESC')
        .page(page, pageSize)
        .countSelect()

      const configs = await this.model('config').getConfig()
      const { thumb_kind, thumb_bangumi_x, thumb_bangumi_y } = configs
      const { data } = list
      for (const item of data) {
        const { imgurl } = item
        item.imgurl = await this.thumbImage(imgurl, thumb_bangumi_x, thumb_bangumi_y, thumb_kind)
      }
      list.data = data
      return this.success(list)
    }
  }

  async postAction() {
    const data = this.post()
    const insertId = await this.modelInstance.addContent(data, this.siteurl)
    if (insertId) {
      return this.success()
    } else {
      return this.fail()
    }
  }

  async putAction() {
    // 列表页更新
    const list = this.post('list')
    if (list) {
      const rows = await this.modelInstance.updateMany(list)
      if (rows) {
        return this.success()
      } else {
        return this.fail()
      }
    }
    // 详情更新
    if (!this.id) {
      return this.fail('CONTENT_NOT_EXIST')
    }
    const data = this.post()
    const influenceId = await this.modelInstance.updateContent(this.id, data, this.siteurl)
    if (influenceId) {
      return this.success()
    } else {
      return this.fail()
    }
  }

  async deleteAction() {
    const list = this.post('list')
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST')
    }
    // TODO目前暂时是将is_recycle设为1，移入回收站
    const data = list.map(item => {
      return {
        id: item,
        updatetime: new Date(),
        is_recycle: 1
      }
    })
    const rows = await this.modelInstance.updateMany(data)
    if (rows) {
      return this.success()
    } else {
      return this.fail()
    }
  }
}
