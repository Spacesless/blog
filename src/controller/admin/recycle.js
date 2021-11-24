const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('admin/recycle');
  }

  // 获取回收站列表
  async getListAction() {
    const { type, page = 1, pageSize = 20 } = this.post();

    const totalList = await this.modelInstance.selectPost(type);

    const result = totalList.slice((page - 1) * pageSize, page * pageSize);
    result.sort((a, b) => {
      return b.updatetime - a.updatetime;
    });

    return this.success({
      count: totalList.length,
      page: page,
      data: result
    });
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
