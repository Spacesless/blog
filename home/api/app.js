import request from '@/plugins/axios'

export function GetMenusAndConfigs() {
  return request({
    url: '/global',
    method: 'get'
  })
}

export function GetCaptcha(options) {
  return request({
    url: '/global/captcha',
    method: 'get',
    params: options
  })
}

export function PostFeedback(data) {
  return request({
    url: '/feedback',
    method: 'post',
    data
  })
}
