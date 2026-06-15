import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '~/utils/auth'

interface UserInfo {
  id?: number
  username?: string
  avatar?: string
  email?: string
  [k: string]: any
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userinfo: {} as UserInfo,
  }),
  getters: {
    isLogin: state => !!state.token,
  },
  actions: {
    async login(payload: { username: string; password: string; captcha: string; remember?: boolean }) {
      const api = useApi()
      const res: any = await api.Login(payload)
      this.token = res.data.token
      setToken(res.data.token, res.data.expires)
    },
    async getInfo() {
      const api = useApi()
      const res: any = await api.GetInfo()
      if (!res?.data) throw new Error('Verification failed, please Login again.')
      this.userinfo = res.data
      return res.data
    },
    async logout() {
      const api = useApi()
      try {
        await api.Logout()
      } finally {
        this.token = ''
        this.userinfo = {}
        removeToken()
      }
    },
    resetToken() {
      this.token = ''
      this.userinfo = {}
      removeToken()
    },
  },
})
