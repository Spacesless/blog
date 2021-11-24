const state = () => ({
  configs: {}
})

const mutations = {
  SET_CONFIGS: (state, configs) => {
    state.configs = { ...state.configs, ...configs }
  }
}

const actions = {
  // 获取配置信息
  getConfigs({ commit }) {
    return new Promise((resolve, reject) => {
      this.$api.config.GetConfigs().then(response => {
        const { data } = response
        commit('SET_CONFIGS', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 更新配置信息
   * @param {Object} data 所需更新的配置
   */
  updateConfigs({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.$api.config.UpdateConfigs(data).then(res => {
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

