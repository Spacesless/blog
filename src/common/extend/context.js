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
  },
  // ajax请求
  get ajaxSupportWebp() {
    const headers = this.header
    const Agents = headers['user-agent']
    const edge = parseInt(Agents.substr(Agents.indexOf('Edge/') + 5))
    const google = parseInt(Agents.substr(Agents.indexOf('Chrome/') + 7))
    const firefox = parseInt(Agents.substr(Agents.indexOf('Firefox/') + 8))
    const opera = parseFloat(Agents.substr(Agents.indexOf('Opera/') + 6))
    return (google >= 23 && !edge) || firefox > 65 || edge > 17 || opera >= 12.1
  }
}
