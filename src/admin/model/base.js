module.exports = class extends think.Model {
  /**
   * 获取封面图片相对地址
   * @param {String} imgurl 封面图片
   * @param {String} siteurl 网站地址
   * @returns  {String}
   */
  getRelativeImgUrl(imgurl, siteurl) {
    return imgurl.replace(siteurl, '');
  }

  /**
   * 获取内容图片相对地址
   * @param {String} content 内容
   * @param {String} siteurl 网站地址
   * @returns  {String}
   */
  getRelativeContentUrl(content, siteurl) {
    return content.replace(new RegExp(siteurl, 'gi'), '')
      .replace(/"upload/gi, '"/upload');
  }
};
