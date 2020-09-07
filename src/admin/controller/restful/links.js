const Base = require('./base')

module.exports = class extends Base {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ id: this.id }).find()
      return this.success(data)
    } else {
      const where = {}
      const field = 'id,name,website,logo,no_order,is_show,addtime'
      const list = await this.modelInstance.where(where)
        .field(field)
        .order('no_order ASC')
        .page(this.get('page'), this.get('pageSize'))
        .countSelect()
      return this.success(list)
    }
  }

  async postAction() {
    const data = this.post()
    const rows = await this.modelInstance.add(data)
    if (rows) {
      return this.success('添加成功')
    } else {
      return this.fail('添加失败')
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
    if (!this.id) {
      return this.fail('CONTENT_NOT_EXIST')
    }
    const rows = await await this.modelInstance.where({ id: this.id }).delete()
    if (rows) {
      return this.success('删除成功')
    } else {
      return this.fail('删除失败')
    }
  }
}
