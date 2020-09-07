import request from '@/utils/request'

/**
 * login 登录
 * @param {Object} {username, password, remember}
 */
export function Login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 拉取用户信息
 * @return {Object} userInfo
 */
export function GetInfo() {
  return request({
    url: '/user/getInfo',
    method: 'get'
  })
}

// 注销
export function Logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 通过邮箱找回密码
 * @param {String} email 邮箱地址
 */
export function ForgotPassword(email) {
  return request({
    url: '/user/forgot',
    method: 'post',
    data: {
      email
    }
  })
}

/**
 * 重置密码
 * @param {String} password md5密码
 * @param {String} resetCode 邮件验证码
 */
export function ResetPassword(password, resetCode) {
  return request({
    url: '/user/reset',
    method: 'post',
    data: {
      password, resetCode
    }
  })
}

/**
 * 更新用户信息
 * @param {Object} data
 */
export function UpdateAdmin(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
