const state = () => ({
  isSupportWebp: false,
  menus: [],
  configs: {},
  device: 'desktop'
})

const mutations = {
  SET_ACCEPT: (state, isSupport) => {
    state.isSupportWebp = isSupport
  },
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
    const accept = req.headers.accept
    commit('SET_ACCEPT', accept.includes('image/webp'))

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
