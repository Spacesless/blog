const Rest = require('../rest')

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ column_id: this.id }).find()
      return this.success(data)
    } else {
      // const where = { module: 5, classtype: 2 };
      // const field = 'id,name';
      const list = await this.modelInstance
        .join({
          table: 'category',
          join: 'inner', // join 方式，有 left, right, inner 3 种方式
          on: ['category_id', 'id'] // ON 条件
        }).select()
      return this.success(list)
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
}
