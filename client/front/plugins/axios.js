const isDev = process.env.NODE_ENV === 'development'

export default function ({ $axios, error }) {
  // url = base url + request url
  $axios.defaults.baseURL = isDev ? 'http://127.0.0.1:8360/front' : 'https://www.timelessq.com/front'
  // request timeout
  $axios.defaults.timeout = 15000

  $axios.onResponse((response) => {
    const { errno } = response.data
    if (errno !== 0) {
      error({ statusCode: 404, message: '哎呀，假装页面未找到' })
    }
    return response.data
  })
}
