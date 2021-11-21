const path = require('path');

module.exports = class extends think.Service {
  constructor(type, configs) {
    super();
    this.thumbnailType = type;
    this.configs = configs;
    this.promiseList = [];

    this.sharpService = think.service('sharp');
  }

  /**
   * 转换列表
   * @param {Array} list
   * @param {Function} predicate
   * @returns
   */
  async formatList(list, predicate) {
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

    for (const item of list) {
      const src = item.imgurl;
      const dest = this.getThumbnail(src, width, height, fit);
      item.imgurl = dest;

      typeof predicate === 'function' && predicate(item);
    }

    if (this.promiseList.length) {
      const result = await Promise.allSettled(this.promiseList);
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
  getThumbnail(src, width, height, fit) {
    // 图片地址或宽高未提供
    if (think.isEmpty(src) || (!width && !height)) {
      return '';
    }

    const destDirname = `${path.dirname(src)}/thumb`;
    const fileSourceName = path.basename(src, path.extname(src));
    const dest = `${destDirname}/${fileSourceName}-w${width}-h${height}.jpg`;

    // 如果命中缓存则直接返回
    if (this.thumbnailCache[dest]) return dest;

    // 如果目标文件不存在，则进行裁剪生成
    const destAbsolutePath = path.join(think.RESOURCE_PATH, dest);
    if (!think.isExist(destAbsolutePath)) {
      const step = this.sharpService.resizeAndCrop({
        width: +width,
        height: +height,
        fit: +fit,
        src,
        dest,
        destAbsolutePath
      });
      this.promiseList.push(step);
    }

    return dest;
  }

  /**
   * 添加缩略图缓存
   * @param {String} url 缩略图地址
   */
  addThumbnailCache(caches) {
    if (!caches.length) return;

    const temp = caches.reduce((cur, next) => {
      cur[next.value] = 1;
      return cur;
    }, {});
    const thumbnailCache = {
      ...this.thumbnailCache,
      ...temp
    };

    return think.cache('thumbnail', thumbnailCache, { timeout: 90 * 24 * 3600 * 1000 });
  }
};
