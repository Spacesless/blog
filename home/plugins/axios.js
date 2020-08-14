const isDev = process.env.NODE_ENV === 'development'

// eslint-disable-next-line standard/object-curly-even-spacing
export default function({ store, app: { $axios }}) {
  // url = base url + request url
  $axios.defaults.baseURL = isDev ? 'http://127.0.0.1:8360/api' : 'https://www.timelessq.com/api'
  // request timeout
  $axios.defaults.timeout = 15000

  $axios.onRequest(configs => {
    configs.headers.common['SupportWebp'] = store.state.isSupportWebp ? 1 : 0
  })

  $axios.onResponse(response => {
    const { errno, msg } = response.data
    if (errno !== 0) {
      return Promise.reject(msg)
    }
    return response.data
  })
}
