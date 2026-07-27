import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from './auth'

export interface ApiResult<T = any> {
  errno: number
  errmsg?: string
  code?: number
  data: T
}

let networkErrorMsg = false
let invalidTokenMsg = false

export function createRequest(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    withCredentials: true,
  })

  instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      ;(config.headers as Record<string, string>).Authorization = token
    }
    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResult>) => {
      const res = response.data
      if (res && res.errno !== 0) {
        ElMessage.error(res.errmsg || 'error')
        if (res.code === 401) {
          if (!invalidTokenMsg) {
            invalidTokenMsg = true
            removeToken()
            ElMessage.error('登录状态已过期，请重新登录！')
            setTimeout(() => {
              if (import.meta.client) location.reload()
            }, 1000)
          }
        }
        return Promise.reject(res.errmsg || 'error')
      }
      return res as unknown as AxiosResponse
    },
    (error) => {
      let message = '[err] ' + error
      if (String(message).includes('Request failed')) message = '网络错误，请稍候重试'
      else if (String(message).includes('timeout')) message = '请求超时，请稍候重试'
      if (!networkErrorMsg) {
        networkErrorMsg = true
        ElMessage.error(message)
        setTimeout(() => { networkErrorMsg = false }, 2000)
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export type RequestFn = <T = any>(config: AxiosRequestConfig) => Promise<ApiResult<T>>
