const path = require('path');

module.exports = {
  get isMobile() {
    return this.ctx.isMobile;
  },

  /**
   * 判断是否在缩略图缓存中
   * @param {String} url 缩略图地址
   * @returns {Boolean}
   */
  hasThumbnailCache(url) {
    const thumbnails = this.cache('thumbnail') || {};
    return thumbnails[url];
  },

  /**
   * 添加缩略图缓存
   * @param {String} url 缩略图地址
   */
  addThumbnailCache(url) {
    if (think.isEmpty(url)) return;
    const thumbnails = this.cache('thumbnail') || {};
    thumbnails[url] = 1;
    this.cache('thumbnail', thumbnails);
  },

  /**
   * 获取缩略图
   * @param {Number} width 目标图片宽度.
   * @param {Number} height 目标图片高度
   * @param {Number} fit 裁剪方式
   * @param {Object} options 目标图片输出参数
   * @returns {String}
   */
  async getThumbnail(src, width, height, fit = 0, options = {}) {
    // 图片地址或宽高未提供
    if (think.isEmpty(src) || (!width && !height)) {
      return '';
    }

    const destDirname = `${path.dirname(src)}/thumb`;
    const fileSourceName = path.basename(src, path.extname(src));
    const dest = `${destDirname}/${fileSourceName}-w${width}-h${height}.jpg`;
    // 如果缓存中存在则直接返回
    if (this.hasThumbnailCache(dest)) {
      return dest;
    }

    // 如果目标文件存在，直接返回
    if (think.isExist(dest)) {
      return dest;
    }

    const SharpHelper = think.service('sharp', 'common');
    const result = await SharpHelper.resizeAndCrop(
      src,
      dest,
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

    this.addThumbnailCache(result);

    return this.getAbsolutePath(result);
  }
};
