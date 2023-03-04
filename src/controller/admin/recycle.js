const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('admin/recycle');
  }

  // 获取回收站列表
  async getListAction() {
    const query = this.get();

    const list = await this.modelInstance.selectPost(query);

    return this.success(list);
  }

  // 删除回收站记录
  async deleteAction() {
    const list = this.post('list');

    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const promises = [];
    list.forEach(item => {
      const { id, type } = item;
      const step = this.model(type).deleteForever(id);
      promises.push(step);
    });

    let rows;
    await Promise.all(promises).then(result => {
      rows = [...result];
    });
    return this.success(rows);
  }

  // 还原回收站
  async restoreAction() {
    const list = this.post('list');

    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const affectedRows = this.modelInstance.restorePost(list);

    return this.success(affectedRows);
  }
};
