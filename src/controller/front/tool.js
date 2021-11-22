const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    const categorys = await this.getCategory();

    // 当前栏目
    const path = this.ctx.path;
    const findCategory = categorys.find(item => item.level === 1 && path.includes(item.type));

    if (!findCategory) {
      return this.ctx.throw(404);
    }

    // webapp列表
    const list = categorys.filter(item => item.type === 'tool' && item.level !== 1);

    return this.success(list);
  }

  async contentAction() {
    const { path } = this.get();

    const categorys = await this.getCategory();

    const findCategory = categorys.find(item => item.filename === path);

    if (!findCategory) {
      return this.ctx.throw(404);
    }

    const data = findCategory;

    return this.success(data);
  }

  async paramsAction() {
    const { id } = this.get();

    const findCategory = await this.model('category')
      .where({ id })
      .field('params')
      .find();

    let params;
    try {
      params = JSON.parse(findCategory.params);
    } catch {
      params = null;
    }
    return this.success(params);
  }
};
