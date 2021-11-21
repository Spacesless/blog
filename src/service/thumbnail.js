const path = require('path');

module.exports = class extends think.Service {
  constructor(type, context, configs) {
    super();
    this.thumbnailType = type;
    this.context = context;
    this.configs = configs;
  }

  async getThumbnail(list) {
    if (!list.length) return [];

    const cache = await think.cache('thumbnail');
    this.thumbnailCache = cache || {};

    if (!this.configs) {
      this.configs = await this.model('config').getCacheConfig();
    }
    const {
      image_fit: fit,
      article_width: articleWidth,
      article_height: articleHeight,
      bangumi_width: bangumiWidth,
      bangumi_height: bangumiHeight
    } = this.configs;
    const width = this.thumbnailType === 'article' ? articleWidth : bangumiWidth;
    const height = this.thumbnailType === 'bangumi' ? articleHeight : bangumiHeight;

    const promises = [];
    const SharpHelper = think.service('sharp');
    for (const item of list) {
      const src = item.imgurl;
      const dest = this.getThumbnailUrl(src, width, height, fit);
      item.imgurl = this.context.getAbsolutePath(dest);

      // 如果命中缓存则直接返回
      if (this.thumbnailCache[dest]) continue;
      // 如果目标文件不存在，则进行裁剪生成
      const destAbsolutePath = path.join(think.RESOURCE_PATH, dest);
      if (!think.isExist(destAbsolutePath)) {
        const step = SharpHelper.resizeAndCrop({
          width: +width,
          height: +height,
          fit: +fit,
          src,
          dest,
          destAbsolutePath
        });
        promises.push(step);
      }
    }

    if (promises.length) {
      const result = await Promise.allSettled(promises);
      await this.addThumbnailCache(result);
    }

    return list;
  }

  /**
   * 获取缩略图
   * @param {String} src 原图地址
   * @param {Number} width 目标图片宽度.
   * @param {Number} height 目标图片高度
   * @returns {String}
   */
  getThumbnailUrl(src, width, height, fit) {
    // 图片地址或宽高未提供
    if (think.isEmpty(src) || (!width && !height)) {
      return '';
    }

    const destDirname = `${path.dirname(src)}/thumb`;
    const fileSourceName = path.basename(src, path.extname(src));
    const dest = `${destDirname}/${fileSourceName}-w${width}-h${height}.jpg`;

    return dest;
  }

  /**
   * 添加缩略图缓存
   * @param {String} url 缩略图地址
   */
  addThumbnailCache(caches) {
    if (!caches.length) return;
    const temp = {};
    caches.forEach(item => {
      temp[item.value] = 1;
    });
    const thumbnailCache = {
      ...this.thumbnailCache,
      ...temp
    };
    return think.cache('thumbnail', thumbnailCache, { timeout: 90 * 24 * 3600 * 1000 });
  }
};
