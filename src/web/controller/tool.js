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

    // meta信息
    const configs = await this.getConfigs();
    const { seo } = this.getListInfo(findCategory.id, categorys, configs);

    // webapp列表
    const list = categorys.filter(item => item.type === 'tool' && item.level !== 1);
    const webapps = this.model('category').formatCategoryUrl(list);

    return this.success({
      seo,
      list: webapps
    });
  }

  async contentAction() {
    const { path } = this.get();

    const categorys = await this.getCategory();

    const findCategory = categorys.find(item => item.filename === path);

    if (!findCategory) {
      return this.ctx.throw(404);
    }

    const configs = await this.getConfigs();
    const { seo } = this.getListInfo(findCategory.id, categorys, configs);

    const data = findCategory;

    return this.success({
      seo,
      data
    });
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
