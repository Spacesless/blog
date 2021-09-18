export default axios => ({
  /**
   * login 登录
   * @param {Object} {username, password, remember}
   */
  Login(data) {
    return axios({
      url: '/user/login',
      method: 'post',
      data
    })
  },

  /**
   * 拉取用户信息
   * @return {Object} userInfo
   */
  GetInfo() {
    return axios({
      url: '/user/getInfo',
      method: 'get'
    })
  },

  // 注销
  Logout() {
    return axios({
      url: '/user/logout',
      method: 'post'
    })
  },

  /**
   * 通过邮箱找回密码
   * @param {String} email 邮箱地址
   */
  ForgotPassword(email) {
    return axios({
      url: '/user/forgot',
      method: 'post',
      data: {
        email
      }
    })
  },

  /**
   * 重置密码
   * @param {String} password md5密码
   * @param {String} resetCode 邮件验证码
   */
  ResetPassword(password, resetCode) {
    return axios({
      url: '/user/reset',
      method: 'post',
      data: {
        password, resetCode
      }
    })
  },

  /**
   * 更新用户信息
   * @param {Object} data
   */
  UpdateAdmin(data) {
    return axios({
      url: '/user/update',
      method: 'post',
      data
    })
  }
})
