module.exports = class extends think.Controller {
  async __before() {
    // 网站地址
    this.siteurl = this.ctx.origin.replace(/http:|https:/, '');

    // 无需鉴权的白名单
    const { controller, action } = this.ctx;
    const whiteController = ['user'];
    const whiteAction = ['login', 'forgot', 'reset', 'captcha'];
    if (whiteController.includes(controller) && whiteAction.includes(action)) {
      return;
    }

    // Session-Cookie鉴权
    const userInfo = await this.session('userInfo');
    if (think.isEmpty(userInfo)) {
      return this.fail(401, '请登录后再操作！');
    }
  }

  /**
   * 获取绝对路径
   * @param {String} src 源路径
   * @returns  {String}
   */
  getAbsolutePath(src) {
    return src ? this.siteurl + src : '';
  }

  /**
   * 获取内容图片绝对地址
   * @param {String} content 内容
   * @returns  {String}
   */
  getContentAbsolutePath(content) {
    return content ? content.replace(/\/upload/gi, this.siteurl + '/upload') : '';
  }
};
