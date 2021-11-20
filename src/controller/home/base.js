module.exports = class extends think.Controller {
  constructor(...arg) {
    super(...arg);
    this.siteurl = '';
  }

  async __before() {
    // 配置信息
    this.siteurl = this.ctx.origin.replace(/http:|https:/, '');
  }

  /**
   * 获取导航菜单数据
   * @returns {Array}
   */
  async getCategory() {
    let categorys = await this.model('category').getCategory();
    categorys = this.model('category').formatCategoryUrl(categorys);
    return categorys;
  }

  __cell() {
    return this.ctx.throw(404);
  }
};
