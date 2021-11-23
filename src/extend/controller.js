const isDev = think.env === 'development';

module.exports = {
  /**
   * 获取绝对路径
   * @param {String} src 源路径
   * @returns  {String}
   */
  getAbsolutePath(src) {
    if (think.isEmpty(src)) {
      return '';
    }
    const prefix = isDev ? this.siteurl : '//cdn.timelessq.com';
    return prefix + src;
  }
};
