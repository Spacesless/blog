import request from '@/utils/request'

export function GetGeneral() {
  return request({
    url: '/general',
    method: 'get'
  })
}
