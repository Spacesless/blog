import md5 from 'md5'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = () => ({
  token: getToken(),
  userinfo: {}
})

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, info) => {
    state.userinfo = info
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password, captcha, remember } = userInfo
    return new Promise((resolve, reject) => {
      this.$api.user.Login({
        username: username.trim(),
        password: md5(password),
        captcha,
        remember
      }).then((response) => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token, data.expires)
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      this.$api.user.GetInfo().then((response) => {
        const { data } = response
        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }

        commit('SET_USERINFO', data)
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      this.$api.user.Logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
