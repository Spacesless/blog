const Base = require('./base.js');

module.exports = class extends Base {
  // 查询栏目内容、参数
  async indexAction() {
    const { id } = this.get();

    const findCategory = await this.model('category')
      .where({ id })
      .field('content,params')
      .find();

    try {
      findCategory.params = JSON.parse(findCategory.params);
    } catch {
      findCategory.params = {};
    }

    return this.success(findCategory);
  }
};
