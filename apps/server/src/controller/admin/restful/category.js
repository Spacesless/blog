const Rest = require('../rest');

module.exports = class extends Rest {
  async getAction() {
    if (this.id) { // 栏目详情
      const data = await this.modelInstance
        .where({ id: this.id })
        .find();

      return this.success(data);
    } else { // 栏目列表
      const list = await this.modelInstance.getCategory();

      return this.success(list);
    }
  }

  // 添加栏目
  async postAction() {
    const data = this.post();
    const rows = await this.modelInstance.add(data);

    if (rows) {
      await think.cache('category', null);
      return this.success();
    } else {
      return this.fail();
    }
  }

  // 更新栏目
  async putAction() {
    if (!this.id) {
      return this.fail('COLUMN_NOT_EXIST');
    }

    const data = this.post();
    const affectedRows = await this.modelInstance.where({ id: this.id }).update(data);

    if (affectedRows) {
      await think.cache('category', null);
      return this.success();
    } else {
      return this.fail();
    }
  }

  // 删除栏目
  async deleteAction() {
    const list = this.post('list');
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const id = list[0];
    await this.modelInstance.deleteColumn(id);
    await think.cache('category', null);

    return this.success();
  }
};
