import request from '@/utils/request'

/**
 * 获取配置信息
 */
export function GetConfigs() {
  return request({
    url: '/config/getConfig',
    method: 'get'
  })
}

/**
 * 更新配置信息
 * @param {Object} data
 */
export function UpdateConfigs(data) {
  return request({
    url: '/config/updateConfig',
    method: 'post',
    data
  })
}
