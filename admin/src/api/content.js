import request from '@/utils/request'

/**
 * 获取详情
 * @param {String} controller 控制器
 * @param {Number [int]} id 
 */
export function GetContent(controller, id) {
  return request({
    url: `/restful/${controller}/${id}`,
    method: 'get'
  })
}

/**
 * 添加详情
 * @param {String} controller 控制器
 * @param {Object} data 详情内容
 */
export function CreateContent(controller, data) {
  return request({
    url: `/restful/${controller}/`,
    method: 'post',
    data
  })
}

/**
 * 更新详情
 * @param {String} controller 控制器
 * @param {Object} data 详情内容
 */
export function UpdateContent(controller, data) {
  return request({
    url: `/restful/${controller}/${data.id}`,
    method: 'put',
    data
  })
}
