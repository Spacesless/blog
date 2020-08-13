const ThinkSvgCaptcha = require('think-svg-captcha')
const path = require('path')

module.exports = class extends think.Service {
  constructor(options) {
    super()
    const defaultOptions = {
      size: 4, // 字符个数
      ignoreChars: '0oO1i', // 过滤字符
      noise: 2, // 噪点线条数量
      color: '#409eff', // default grey, true if background option is set
      background: '#ecf5ff', // svg image 背景颜色
      width: 120, // captcha 宽度
      height: 40, // captcha 高度
      fontPath: path.join(think.RESOURCE_PATH, '/fonts/NeoSansStd.ttf'), // 字体文件路径
      fontSize: 36, // captcha 文字大小
      charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' // random character preset
    }
    this.options = options ? Object.assign(defaultOptions, options) : defaultOptions
  }

  /**
   * 创建验证码
   * @returns {Object} {data: 'svg path data', text: 'captcha text'}
   */
  createCaptcha() {
    const captcha = new ThinkSvgCaptcha(this.options)
    const captchaData = captcha.create()
    return captchaData
  }
}
