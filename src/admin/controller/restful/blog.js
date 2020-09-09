const Rest = require('../rest')

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ id: this.id }).find()
      data.imgurl = data.imgurl ? this.siteurl + data.imgurl : ''
      data.content = data.content.replace(/upload/gi, this.siteurl + '/upload')
      return this.success(data)
    } else {
      const { keyword, class1, class2, class3, page, pageSize } = this.get()
      const where = { is_recycle: 0 }
      if (keyword) {
        where.title = ['like', `%${keyword}%`]
      }
      if (class1) where.class1 = class1
      if (class2) where.class2 = class2
      if (class3) where.class3 = class3
      const field = 'id,title,imgurl,hits,updatetime,is_show'
      const list = await this.modelInstance.where(where)
        .field(field)
        .order('updatetime DESC')
        .page(page, pageSize)
        .countSelect()

      const configs = await this.model('config').getConfig()
      const {
        thumb_kind: fit,
        thumb_blog_x: width,
        thumb_blog_y: height
      } = configs
      const { data } = list
      for (const item of data) {
        const { imgurl } = item
        item.imgurl = await this.thumbImage(imgurl, width, height, fit)
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
