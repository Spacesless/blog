const state = () => ({
  categories: [],
  updateRoute: ''
})

const mutations = {
  SET_CATEGORY: (state, categories) => {
    state.categories = categories
  },
  SET_UPDATELIST: (state, module) => {
    state.updateRoute = module
  }
}

const actions = {
  // 获取栏目列表
  getCategory ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$api.list.GetList('category').then((res) => {
        commit('SET_CATEGORY', res.data)
        resolve(res.data)
      }).catch((error) => {
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
