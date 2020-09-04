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
 * 获取管理员列表
 * @param {Object} query 查询条件
 */
export function GetAdminList(query) {
  return request({
    url: '/user/getAdmin',
    method: 'get',
    params: query
  })
}

export function UpdateAdminInfo(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
