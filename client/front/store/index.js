const state = () => ({
  categories: [],
  configs: {},
  device: 'desktop',
  activeMenu: ''
})

const mutations = {
  SET_CATEGORY: (state, categories) => {
    state.categories = categories
  },
  SET_ACTIVE_MENU: (state, activeMenu) => {
    state.activeMenu = activeMenu
  },
  SET_CONFIGS: (state, configs) => {
    state.configs = configs
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  async nuxtServerInit ({ commit }, { req, $axios }) {
    // 获取菜单以及系统配置
    const { categories, configs } = await $axios.$get('/general')
    commit('SET_CATEGORY', categories)
    commit('SET_CONFIGS', configs)
  },
  toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
