import md5 from 'md5'
import { createRequest } from '~/utils/request'

let _instance: ReturnType<typeof createRequest> | null = null

function getInstance() {
  if (_instance) return _instance
  const cfg = useRuntimeConfig()
  _instance = createRequest(cfg.public.apiBase as string)
  return _instance
}

export function useApi() {
  const axios = getInstance()

  return {
    // ===== user =====
    Login(data: { username: string; password: string; captcha: string; remember?: boolean }) {
      return axios({
        url: '/user/login',
        method: 'post',
        data: { ...data, password: md5(data.password) },
      })
    },
    GetInfo() {
      return axios({ url: '/user/getInfo', method: 'get' })
    },
    Logout() {
      return axios({ url: '/user/logout', method: 'post' })
    },
    ForgotPassword(email: string) {
      return axios({ url: '/user/forgot', method: 'post', data: { email } })
    },
    ResetPassword(password: string, resetCode: string) {
      return axios({ url: '/user/reset', method: 'post', data: { password: md5(password), resetCode } })
    },
    UpdateAdmin(data: any) {
      return axios({ url: '/user/update', method: 'post', data })
    },

    // ===== content =====
    GetContent(controller: string, id: number | string) {
      return axios({ url: `/restful/${controller}/${id}`, method: 'get' })
    },
    CreateContent(controller: string, data: any) {
      return axios({ url: `/restful/${controller}/`, method: 'post', data })
    },
    UpdateContent(controller: string, data: any) {
      return axios({ url: `/restful/${controller}/${data.id}`, method: 'put', data })
    },

    // ===== list =====
    GetList(controller: string, query?: any) {
      return axios({ url: `/restful/${controller}/`, method: 'get', params: query })
    },
    DeleteList(controller: string, list: number[]) {
      return axios({ url: `/restful/${controller}/`, method: 'delete', data: { list } })
    },
    UpdateList(controller: string, list: any[]) {
      return axios({ url: `/restful/${controller}/`, method: 'put', data: { list } })
    },
    GetRecycleList(query?: any) {
      return axios({ url: '/recycle/getList', method: 'get', params: query })
    },
    RestoreRecycleList(list: number[]) {
      return axios({ url: '/recycle/restore', method: 'post', data: { list } })
    },
    DeleteRecyleList(list: number[]) {
      return axios({ url: '/recycle/delete', method: 'post', data: { list } })
    },

    // ===== config =====
    GetConfigs() {
      return axios({ url: '/config/getConfig', method: 'get' })
    },
    UpdateConfigs(data: any) {
      return axios({ url: '/config/updateConfig', method: 'post', data })
    },

    // ===== home =====
    GetGeneral() {
      return axios({ url: '/general', method: 'get' })
    },

    // ===== common =====
    RefreshCache() {
      return axios.get('/general/refresh')
    },
    ClearThumbnail() {
      return axios.get('/general/clearThumbnail')
    },
    UploadFiles(formData: FormData) {
      return axios({
        url: '/file/post',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
      })
    },
    GetPathList(query?: any) {
      return axios({ url: '/file/get', method: 'get', params: query })
    },
    GetCaptcha(params?: any) {
      return axios({ url: '/user/captcha', method: 'get', params })
    },
  }
}
