const { PasswordHash } = require('phpass')
const Base = require('./base.js')

module.exports = class extends Base {
  /**
   * 哈希密码
   * @param {String} username []
   * @param {String} salt     []
   * @return {String}          []
   */
  getEncryptPassword(password) {
    const passwordHash = new PasswordHash()
    const hash = passwordHash.hashPassword(password)
    return hash
  }

  /**
   * 保存用户信息
   * @param {Number} id 用户id
   * @param {Object} data 用户信息
   */
  async saveMember(id, data) {
    const info = await this.where({ id }).find()
    if (think.isEmpty(info)) {
      return Promise.reject(new Error('UESR_NOT_EXIST'))
    }
    const password = data.password
    if (password) {
      data.password = this.getEncryptPassword(password)
    }
    data.login_time = think.datetime()
    return this.where({ id }).update(data)
  }
}
