import { GetConfigs, UpdateConfigs } from '@/api/config'

const state = {
  config: {}
}

const mutations = {
  SET_CONFIG: (state, config) => {
    state.config = config
  }
}

const actions = {
  // 获取配置信息
  getConfig({ commit }) {
    return new Promise((resolve, reject) => {
      GetConfigs().then(response => {
        const { data } = response
        commit('SET_CONFIG', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 更新配置信息
  updateConfig({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      UpdateConfigs(data).then(response => {
        commit('SET_CONFIG', { ...state.config, ...data })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

