const Rest = require('../rest')

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ id: this.id }).find()
      return this.success(data)
    } else {
      const list = await this.modelInstance.getCategory()
      return this.success(list)
    }
  }

  async postAction() {
    const data = this.post()
    const rows = await this.modelInstance.add(data)
    if (rows) {
      return this.success()
    } else {
      return this.fail()
    }
  }

  async putAction() {
    if (!this.id) {
      return this.fail('COLUMN_NOT_EXIST')
    }
    const data = this.post()
    const rows = await this.modelInstance.where({ id: this.id }).update(data)
    if (rows) {
      await think.cache('column', null)
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
    const promises = []
    list.forEach(async(item) => {
      const id = item.id
      const exist = await this.model(item.type).where({ id }).count('id')
      let step
      if (exist) {
        step = this.modelInstance.deleteColumn(id)
      }
      promises.push(step)
    })
    await Promise.all(promises)
    await think.cache('column', null)
    return this.success()
  }
}
