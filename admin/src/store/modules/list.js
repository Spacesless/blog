import { GetList } from '@/api/list'

const state = {
  columns: [],
  updateRoute: ''
}

const mutations = {
  SET_COLUMNS: (state, columns) => {
    state.columns = columns
  },
  SET_UPDATELIST: (state, module) => {
    state.updateRoute = module
  }
}

const actions = {
  // 获取栏目列表
  getColumns({ commit }) {
    return new Promise((resolve, reject) => {
      GetList('column').then(res => {
        commit('SET_COLUMNS', res.data)
        resolve(res.data)
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

