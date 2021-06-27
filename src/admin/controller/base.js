module.exports = class extends think.Controller {
  async __before() {
    this.siteurl = this.ctx.origin.replace(/http:|https:/, '');

    const { controller, action } = this.ctx;
    const whiteController = ['user']; // 无需鉴权的白名单
    const whiteAction = ['login', 'forgot', 'reset', 'captcha'];
    if (whiteController.includes(controller) && whiteAction.includes(action)) {
      return;
    }

    const userInfo = await this.session('userInfo');
    if (think.isEmpty(userInfo)) {
      return this.fail(401, '请登录后再操作！');
    }
  }

  /**
   * 裁剪图片
   * @param {Number} width 目标图片宽度.
   * @param {Number} height 目标图片高度
   * @param {Number} fit 裁剪方式
   * @param {Object} options 目标图片输出参数
   */
  async thumbImage(src, width, height, fit = 0, options = {}) {
    if (think.isEmpty(src)) return '';
    const isSupportWebp = Number(this.ctx.headers.SupportWebp);
    const dest = await think.sharpResize(
      src,
      {
        width: +width,
        height: +height,
        fit: +fit
      },
      {
        format: isSupportWebp ? 'webp' : 'jpg',
        ...options
      }
    );

    return dest ? this.siteurl + dest : '';
  }

  /**
   * 获取封面图片绝对地址
   * @param {String} imgurl 封面图片
   * @returns  {String}
   */
  getResolveImgUrl(imgurl) {
    return imgurl ? this.siteurl + imgurl : '';
  }

  /**
   * 获取内容图片绝对地址
   * @param {String} content 内容
   * @returns  {String}
   */
  getResolveContentUrl(content) {
    return content ? content.replace(/\/upload/gi, this.siteurl + '/upload') : '';
  }
};
