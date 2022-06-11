import { Message } from 'element-ui'

let networkErrorMsg = false
let invalidTokenMsg = false
const _Message = Message

export default function ({ store, app: { $axios } }) {
  // request timeout
  $axios.defaults.timeout = 15000

  $axios.onResponse((response) => {
    const res = response.data

    // if the custom code is not 0, it is judged as an error.
    if (res.errno !== 0) {
      _Message({
        message: res.errmsg || 'error',
        type: 'error'
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401) {
        // to re-login
        if (!invalidTokenMsg) {
          invalidTokenMsg = true
          store.dispatch('user/logout').then(() => {
            _Message.error('登录状态已过期，请重新登录！')
            setTimeout(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            }, 1000)
          })
        }
      }
      return Promise.reject(res.errmsg || 'error')
    } else {
      return res
    }
  },
  (error) => {
    let message = '[err] ' + error
    console.log(message) // for debug

    if (message.includes('Request failed')) {
      message = '网络错误，请稍候重试'
    } else if (message.includes('timeout')) {
      message = '请求超时，请稍候重试'
    }

    if (!networkErrorMsg) {
      networkErrorMsg = true
      _Message.error(message || error.toString())
      setTimeout(() => {
        networkErrorMsg = false
      }, 2000) // duration = 2000ms
    }

    return Promise.reject(error)
  })
}
