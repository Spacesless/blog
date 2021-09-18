export default axios => ({
  /**
   * 获取详情
   * @param {String} controller 控制器
   * @param {Number [int]} id
   */
  GetContent(controller, id) {
    return axios({
      url: `/restful/${controller}/${id}`,
      method: 'get'
    })
  },

  /**
   * 添加详情
   * @param {String} controller 控制器
   * @param {Object} data 详情内容
   */
  CreateContent(controller, data) {
    return axios({
      url: `/restful/${controller}/`,
      method: 'post',
      data
    })
  },

  /**
   * 更新详情
   * @param {String} controller 控制器
   * @param {Object} data 详情内容
   */
  UpdateContent(controller, data) {
    return axios({
      url: `/restful/${controller}/${data.id}`,
      method: 'put',
      data
    })
  }
})
