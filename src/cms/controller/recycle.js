const Base = require('./base.js');

module.exports = class extends Base {
  async getListAction() {
    const field = 'id,title,class1,class2,class3,updatetime';
    const module = +this.get('module');
    const blog = module && module !== 2 ? [] : await this.model('blog')
      .field(`${field},'blog' as module`)
      .where({ is_recycle: 1 })
      .select();
    const image = module && module !== 3 ? [] : await this.model('image')
      .field(`${field},'image' as module`)
      .where({ is_recycle: 1 })
      .select();
    const bangumi = module && module !== 4 ? [] : await this.model('bangumi')
      .field(`${field},'bangumi' as module`)
      .where({ is_recycle: 1 })
      .select();
    const list = [...blog, ...image, ...bangumi];
    const page = this.get('page') ? this.get('page') : 1;
    const pageSize = this.get('limit') ? this.get('limit') : 20;
    const result = list.slice((page - 1) * pageSize, page * pageSize);
    result.sort((a, b) => {
      return b.updatetime - a.updatetime;
    });
    return this.success({
      count: list.length,
      page: page,
      data: result
    });
  }

  async deleteAction() {
    const list = this.post('list');
    const promises = [];
    list.forEach(item => {
      const id = item.id;
      const module = item.module;
      const step = this.model(module).foreverDelete(id);
      promises.push(step);
    });

    let rows;
    await Promise.all(promises).then(result => {
      rows = [...result];
    });
    return this.success(rows);
  }

  async restoreAction() {
    const list = this.post('list');
    const promises = [];
    list.forEach(item => {
      const id = item.id;
      const module = item.module;
      const step = this.model(module).where({ id }).update({ is_recycle: 0 });
      promises.push(step);
    });

    let rows;
    await Promise.all(promises).then(result => {
      rows = [...result];
    });
    return this.success(rows);
  }
};
