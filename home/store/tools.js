const state = () => ({
  bubbleActive: true,
  live2dShow: true
})

const mutations = {
  TOGGLE_BUBBLE: state => {
    state.bubbleActive = !state.bubbleActive
  },
  SET_LIVE2D: (state, isShow) => {
    state.live2dShow = isShow
  },
  TOGGLE_LIVE2D: state => {
    state.live2dShow = !state.live2dShow
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
