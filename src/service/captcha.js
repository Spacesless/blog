const svgCaptcha = require('svg-captcha');

module.exports = class extends think.Service {
  /**
   * svg图片验证码服务
   * @param {Object} options
   * @see https://github.com/produck/svg-captcha
   */
  constructor(options) {
    super();
    const defaultOptions = {
      size: 4, // 字符个数
      ignoreChars: '0oO1ilI', // 过滤字符
      noise: 2, // 噪点线条数量
      // color: '#409eff', // default grey, true if background option is set
      // background: '#fafafa', // svg image 背景颜色
      width: 120, // captcha 宽度
      height: 40, // captcha 高度
      fontSize: 36 // captcha 文字大小
    };
    this.options = {
      ...defaultOptions,
      ...options
    };
  }

  /**
   * 创建普通字符验证码
   * @returns {Object} {data: 'svg path data', text: 'captcha text'}
   */
  createCaptcha() {
    return svgCaptcha.create(this.options);
  }

  /**
   * 创建算术验证码
   * @summary 生成的 svg 是一个算数式，而 text 属性上是算数式的结果
   * @returns {Object} {data: 'svg path data', text: 'captcha text'}
   */
  createMathExpr() {
    return svgCaptcha.createMathExpr(this.options);
  }
};
