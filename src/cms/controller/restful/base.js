const BaseRest = require('../rest');

module.exports = class extends BaseRest {
  async __before() {
    const userInfo = await this.session('userInfo') || {};
    if (think.isEmpty(userInfo)) {
      return this.fail(401, '未授权，请登录后再操作！');
    }

    this.siteurl = this.ctx.origin.replace(/http:|https:/, '');
  }

  /**
   * 裁剪图片
   * @param {Number} width 目标图片宽度.
   * @param {Number} height 目标图片高度
   * @param {Number} fit 裁剪方式
   * @param {Object} options 目标图片输出参数
   */
  async thumbImage(src, width, height, fit = 0, options = {}) {
    if (think.isEmpty(src)) return ''
    const isSupportWebp = this.ajaxSuportWebp
    const dest = await think.sharpResize(
      src,
      {
        width: +width,
        height: +height,
        fit: +fit
      },
      {
        format: +isSupportWebp ? 'webp' : 'jpg',
        ...options
      }
    );

    return dest ? this.siteurl + dest : '';
  }

  async __call() {
    return this.fail(404, '该功能未开发 || 本就没有');
  }
};
