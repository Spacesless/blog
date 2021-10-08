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
   * 获取缩略图
   * @param {Number} width 目标图片宽度.
   * @param {Number} height 目标图片高度
   * @param {Number} fit 裁剪方式
   * @param {Object} options 目标图片输出参数
   * @returns {String}
   */
  async getThumbnail(src, width, height, fit = 0, options = {}) {
    if (think.isEmpty(src)) return '';

    const SharpHelper = think.service('sharp', 'common');
    const dest = await SharpHelper.resizeAndCrop(
      src,
      {
        width: +width,
        height: +height,
        fit: +fit
      },
      {
        format: 'jpg',
        ...options
      }
    );

    return this.getAbsolutePath(dest);
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
