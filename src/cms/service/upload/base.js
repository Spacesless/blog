const path = require('path');
const moment = require('moment');

module.exports = class extends think.Service {
  /**
   * 域名不带http/https自动补全http
   * @param {String} origin 源地址
   */
  getAbsOrigin(origin) {
    const reg = /^(https?:)?\/\/.+/;
    if (!reg.test(origin)) {
      return `http://${origin}`;
    }
    return origin;
  }

  /**
   * 获取当前的格式化时间
   * @returns {String} YYYYMM 年月
   */
  getYearMonth() {
    return moment(new Date()).format('YYYYMM');
  }

  /**
   * 获取存储路径
   * @param {String} filename 文件名
   * @param {String} prefix 目录前缀
   */
  getSavePath(filename, prefix) {
    prefix = prefix ? `${prefix}/` : '';
    const dir = this.getYearMonth();
    const basename = path.basename(filename);
    return `${prefix}${dir}/${basename}`;
  }
};
