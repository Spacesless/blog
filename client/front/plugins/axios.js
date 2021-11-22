const isDev = process.env.NODE_ENV === 'development'

export default function({ store, app: { $axios }}) {
  // url = base url + request url
  $axios.defaults.baseURL = isDev ? 'http://127.0.0.1:8360/web' : 'https://www.timelessq.com/web'
  // request timeout
  $axios.defaults.timeout = 15000

  $axios.onResponse(response => {
    const { errno, errmsg } = response.data
    if (errno !== 0) {
      return Promise.reject(errmsg)
    }
    return response.data
  })
}
