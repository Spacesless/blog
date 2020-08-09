import request from '@/utils/request'

export function GetConfigs() {
  return request({
    url: '/config/getConfig',
    method: 'get'
  })
}
  
export function UpdateConfigs(data) {
  return request({
    url: '/config/updateConfig',
    method: 'post',
    data
  })
}
