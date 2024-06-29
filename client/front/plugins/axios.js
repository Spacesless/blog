const isDev = process.env.NODE_ENV === 'development'

export default function ({ $axios, redirect }) {
  // url = base url + request url
  $axios.defaults.baseURL = isDev ? 'http://127.0.0.1:8360/front' : 'https://www.timelessq.com/front'
  // request timeout
  $axios.defaults.timeout = 15000

  $axios.onResponse((response) => {
    const { errno, errmsg } = response.data
    if (errno === 404) {
      return redirect('/404')
    }
    if (errno === 0) {
      return response.data
    } else {
      let message = '请求错误'
      if (errmsg) {
        try {
          message = JSON.stringify(errmsg)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e)
        }
      }
      return Promise.reject(new Error(message))
    }
  })
}
