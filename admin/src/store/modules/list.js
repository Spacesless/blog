import { GetList } from '@/api/list'

const state = {
  column: [],
  updateRoute: ''
}

const mutations = {
  SET_COLUMN: (state, column) => {
    state.column = column
  },
  SET_UPDATELIST: (state, module) => {
    state.updateRoute = module
  }
}

const actions = {
  // 获取栏目列表
  getColumn({ commit }) {
    return new Promise((resolve, reject) => {
      GetList('column').then(response => {
        const { data } = response
        commit('SET_COLUMN', data)
        resolve(data)
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

