export default axios => ({
  GetGeneral() {
    return axios({
      url: '/general',
      method: 'get'
    })
  },

  GetNewComments() {
    return axios({
      url: '/general/comment',
      method: 'get'
    })
  }
})
