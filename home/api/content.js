import request from '@/plugins/axios'

/**
 * 查询分页数据
 * @param {String} controller 控制器
 * @param {Object} query 查询条件
 */
export function GetContentData(controller, id) {
  return request({
    url: `/${controller}/content`,
    method: 'get',
    params: {
      id
    }
  })
}
