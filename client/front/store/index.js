const state = () => ({
  menus: [],
  configs: {},
  device: 'desktop'
})

const mutations = {
  SET_MENUS: (state, menus) => {
    state.menus = menus
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
    const { navigation, configs } = await $axios.$get(`/general`)
    commit('SET_MENUS', navigation)
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
