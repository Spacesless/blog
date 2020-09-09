const Rest = require('../rest')

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ id: this.id }).find()
      return this.success(data)
    } else {
      const where = {}
      const field = 'id,content,addtime,username'
      const list = await this.modelInstance.where(where)
        .field(field)
        .order('addtime DESC')
        .page(this.get('page'), this.get('pageSize'))
        .countSelect()
      return this.success(list)
    }
  }

  async postAction() {
    const list = this.post('list')
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST')
    }
    const rows = await this.modelInstance.updateMany(list)
    if (rows) {
      return this.success()
    } else {
      return this.fail()
    }
  }

  async putAction() {
    if (!this.id) {
      return this.fail('CONTENT_NOT_EXIST')
    }
    const data = this.post()
    const rows = await this.modelInstance.where({ id: this.id }).update(data)
    if (rows) {
      return this.success('更新成功')
    } else {
      return this.fail('更新失败')
    }
  }

  async deleteAction() {
    const list = this.post('list')
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST')
    }
    const promises = []
    list.forEach(async(item) => {
      const id = item.id
      const exist = await this.modelInstance.where({ id }).count('id')
      let step
      if (exist) {
        step = this.modelInstance.where({ id }).delete()
      }
      promises.push(step)
    })
    await Promise.all(promises)
    return this.success()
  }
}
