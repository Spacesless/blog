module.exports = {
  /**
   * 判断当前请求是不是手机访问
   * @returns {Boolean} 是否手机访问
   */
  get isMobile() {
    const userAgent = this.userAgent.toLowerCase();
    const mobileList = ['iphone', 'android'];
    return mobileList.some(item => userAgent.indexOf(item) > -1);
  }
};
