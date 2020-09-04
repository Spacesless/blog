const { PasswordHash } = require('phpass')
const Base = require('./base.js')

module.exports = class extends Base {
  /**
   * 哈希密码
   * @param {String} password 密码
   * @return {String} 哈希后的字符串
   */
  getEncryptPassword(password) {
    const passwordHash = new PasswordHash()
    const hash = passwordHash.hashPassword(password)
    return hash
  }

  /**
   * 检测密码是否一致
   * @param {Object} userInfo 用户信息
   * @param {String} password 要验证的密码
   * @return {Boolean}
   */
  checkPassword(userInfo, password) {
    const passwordHash = new PasswordHash()
    return passwordHash.checkPassword(password, userInfo.password)
  }

  /**
   * 保存用户信息
   * @param {Object} data 用户信息
   * @param {String} ip 客户端ip地址
   */
  async saveAdmin(data, ip) {
    const info = await this.where({ id: data.id }).find()
    if (think.isEmpty(info)) {
      return Promise.reject(new Error('UESR_NOT_EXIST'))
    }
    const { id, password } = data
    if (password) {
      data.password = this.getEncryptPassword(password)
    }
    data.login_ip = ip
    data.login_time = think.datetime()
    return this.where({ id }).update(data)
  }

  /**
   * 更新用户的登录信息
   * @param {Object} user 用户信息
   */
  async updateLoginInfo(user) {
    return this.where({ id: user.id }).update({
      login_time: think.datetime(),
      login_ip: user.login_ip
    })
  }
}
