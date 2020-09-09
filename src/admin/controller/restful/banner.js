const Rest = require('../rest')

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ id: this.id }).find()
      data.imgurl = data.imgurl ? this.siteurl + data.imgurl : ''
      return this.success(data)
    } else {
      const field = 'id,title,description,imgurl,sort'
      const list = await this.modelInstance
        .field(field)
        .order('sort ASC')
        .select()

      // const configs = await this.model('config').getConfig()
      // const {
      //   thumb_kind: fit,
      //   thumb_banner_x: width,
      //   thumb_banner_y: height
      // } = configs
      for (const item of list) {
        const { imgurl } = item
        item.imgurl = this.siteurl + imgurl
        // item.imgurl = await this.thumbImage(imgurl, width, height, fit)
      }
      return this.success(list)
    }
  }

  async postAction() {
    const data = this.post()
    const { imgurl } = data
    if (imgurl) data.imgurl = imgurl.replace(this.siteurl, '')
    const insertId = await this.modelInstance.add(data)
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
    const { imgurl } = data
    if (imgurl) data.imgurl = imgurl.replace(this.siteurl, '')
    const influenceId = await this.modelInstance.where({ id: this.id }).update(data)
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
    const rows = await this.modelInstance.where({ id: ['IN', list] }).delete()
    if (rows) {
      return this.success()
    } else {
      return this.fail()
    }
  }
}
