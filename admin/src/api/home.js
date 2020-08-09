import request from '@/utils/request'

export function getPanelInfo() {
  return request({
    url: '/index/getPanel',
    method: 'get'
  })
}
