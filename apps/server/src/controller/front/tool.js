const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    const id = this.get('id');

    const categories = await this.getCategory();

    // 当前栏目
    let findCategory = {};
    let list = [];
    if (!think.isEmpty(id)) {
      findCategory = categories.find(item => item.id === +id && item.type === 'tool');
      if (!findCategory) {
        return this.fail(404);
      }
      const childCategories = await this.model('category').findChildCategory(categories, findCategory.id);

      list = categories.filter(item => childCategories.includes(item.id) && item.level !== 1);
    } else {
      list = categories.filter(item => item.type === 'tool' && item.level !== 1);
    }

    return this.success(list);
  }
};
