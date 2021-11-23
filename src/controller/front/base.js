module.exports = class extends think.Controller {
  /**
   * 获取系统配置
   * @returns {Object}
   */
  getConfigs() {
    return this.model('config').getCacheConfig();
  }

  /**
   * 获取导航菜单数据
   * @returns {Array}
   */
  getCategory() {
    return this.model('category').getCacheCategory();
  }

  __cell() {
    return this.ctx.throw(404);
  }
};
