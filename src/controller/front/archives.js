const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    const categories = await this.getCategory();

    const articleCategories = categories.filter(item => item.type === 'article')
      .map(item => item.id);

    const list = await this.model('front/archives').selectPost(articleCategories);

    return this.success(list);
  }
};
