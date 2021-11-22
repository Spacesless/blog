const state = () => ({
  categories: [],
  configs: {},
  device: 'desktop'
})

const mutations = {
  SET_CATEGORY: (state, categories) => {
    state.categories = categories
  },
  SET_CONFIGS: (state, configs) => {
    state.configs = configs
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  async nuxtServerInit({ commit }, { req, $axios }) {
    // 获取菜单以及系统配置
    const { categoryList, configs } = await $axios.$get(`/general`)
    commit('SET_CATEGORY', categoryList)
    commit('SET_CONFIGS', configs)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
