import request from '@/plugins/axios'

export function GetHomePage() {
  return request({
    url: '/index',
    method: 'get'
  })
}

/**
 * 查询分页数据
 * @param {String} controller 控制器
 * @param {Object} query 查询条件
 */
export function GetListPage(controller, query) {
  return request({
    url: `/${controller}/list`,
    method: 'get',
    params: query
  })
}

export function GetLinksList() {
  return request({
    url: '/links',
    method: 'get'
  })
}

export function GetSearchList(query) {
  return request({
    url: '/search',
    method: 'get',
    params: query
  })
}
