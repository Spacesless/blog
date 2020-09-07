import { getLocalStorage, updateLocalStorage } from '@/utils/index'
const { isShow } = getLocalStorage('waifu')

const state = () => ({
  bubbleActive: true,
  live2dShow: isShow == null ? true : isShow
})

const mutations = {
  TOGGLE_BUBBLE: state => {
    state.bubbleActive = !state.bubbleActive
  },
  SET_LIVE2D: (state, isShow) => {
    state.live2dShow = isShow
    updateLocalStorage('waifu', { isShow })
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
