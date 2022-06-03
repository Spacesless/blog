module.exports = class extends think.Controller {
  __before() {
    const referer = this.header('referer');
    const whiteList = ['127.0.0.1', 'timelessq.com'];
    if (!referer || whiteList.every(item => !referer.includes(item))) {
      return this.ctx.throw(403);
    }
  }

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
