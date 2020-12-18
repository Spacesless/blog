import request from '@/utils/request'

export function GetGeneral() {
  return request({
    url: '/general',
    method: 'get'
  })
}

export function GetNewComments() {
  return request({
    url: '/general/comment',
    method: 'get'
  })
}
