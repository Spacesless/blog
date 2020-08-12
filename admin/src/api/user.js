import request from '@/utils/request'

/**
 * login 登录
 * @param {Object} {username, password, remember}
 */
export function Login(data) {
  return request({
    url: '/admin/login',
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
    url: '/admin/getInfo',
    method: 'get'
  })
}

// 注销
export function Logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

/**
 * 获取图片验证码
 * @param {Object} params 图片验证码参数
 * @returns {Element} svg图片
 */
export function GetCaptcha(params) {
  return request({
    url: '/admin/captcha',
    method: 'get',
    params
  })
}

/**
 * 获取管理员列表
 * @param {Object} query 查询条件
 */
export function GetAdminList(query) {
  return request({
    url: '/admin/getAdmin',
    method: 'get',
    params: query
  })
}

export function UpdateAdminInfo(data) {
  return request({
    url: '/admmin/update',
    method: 'post',
    data
  })
}
