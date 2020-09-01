const moment = require('moment')

module.exports = class extends think.Service {
  /**
   * 获取当前的格式化时间
   * @returns {String} YYYYMM 年月
   */
  getYearMonth() {
    return moment(new Date()).format('YYYYMM')
  }
}
