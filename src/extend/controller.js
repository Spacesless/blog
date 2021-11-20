const path = require('path');

module.exports = {
  /**
   * 添加缩略图缓存
   * @param {String} url 缩略图地址
   */
  addThumbnailCache(url) {
    if (think.isEmpty(url)) return;
    this.thumbnailCache[url] = 1;
    return this.cache('thumbnail', this.thumbnailCache, { timeout: 90 * 24 * 3600 * 1000 });
  },

  /**
   * 获取缩略图
   * @param {Number} width 目标图片宽度.
   * @param {Number} height 目标图片高度
   * @param {Number} fit 裁剪方式
   * @param {Object} options 目标图片输出参数
   * @returns {String}
   */
  async getThumbnail(src, width, height, fit, options) {
    // 图片地址或宽高未提供
    if (think.isEmpty(src) || (!width && !height)) {
      return '';
    }

    if (!this.thumbnailCache) {
      const cache = await this.cache('thumbnail');
      this.thumbnailCache = cache || {};
    }
    const destDirname = `${path.dirname(src)}/thumb`;
    const fileSourceName = path.basename(src, path.extname(src));
    let dest = `${destDirname}/${fileSourceName}-w${width}-h${height}.jpg`;
    // 如果命中缓存则直接返回
    if (this.thumbnailCache[dest]) {
      return this.getAbsolutePath(dest);
    }

    // 如果目标文件不存在，则进行裁剪生成
    const destAbsolutePath = path.join(think.RESOURCE_PATH, dest);
    if (!think.isExist(destAbsolutePath)) {
      const SharpHelper = think.service('sharp');
      dest = await SharpHelper.resizeAndCrop({
        width: +width,
        height: +height,
        fit: +fit,
        src,
        dest,
        destAbsolutePath
      }, options);
    }
    // 否则直接添加到缓存，并返回
    await this.addThumbnailCache(dest);

    return this.getAbsolutePath(dest);
  }
};
