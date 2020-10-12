module.exports = {
  /**
   * 判断当前请求是不是手机访问
   * @returns {Boolean} 是否手机访问
   */
  get isMobile() {
    const userAgent = this.userAgent.toLowerCase()
    const mobileList = ['iphone', 'android']
    return mobileList.some(item => userAgent.indexOf(item) > -1)
  },
  /**
   * 判断客户端是否支持webp格式
   * @summary 非ajax请求
   * @returns {Boolean} 是否支持webp格式
   */
  get isSupportWebp() {
    const accept = this.header.accept
    return accept.includes('image/webp')
  }
}
