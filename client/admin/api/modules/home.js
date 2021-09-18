export default axios => ({
  // 获取统计信息
  GetGeneral() {
    return axios({
      url: '/general',
      method: 'get'
    })
  },

  // 获取最新未读的评论
  GetNewComments() {
    return axios({
      url: '/general/comment',
      method: 'get'
    })
  }
})
