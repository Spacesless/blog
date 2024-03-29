const Cookies = process.client ? require('js-cookie') : undefined

const state = () => ({
  sidebar: {
    opened: Cookies && Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  particleActive: false,
  live2dShow: false
})

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  OPEN_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 1)
    state.sidebar.opened = true
    state.sidebar.withoutAnimation = withoutAnimation
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  SET_PARTICLE: (state, isShow) => {
    state.particleActive = isShow
  },
  SET_LIVE2D: (state, isShow) => {
    state.live2dShow = isShow
  }
}

const actions = {
  toggleSideBar ({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  openSideBar ({ commit }, { withoutAnimation }) {
    commit('OPEN_SIDEBAR', withoutAnimation)
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
