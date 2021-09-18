export default axios => ({
  /**
   * 获取配置信息
   */
  GetConfigs() {
    return axios({
      url: '/config/getConfig',
      method: 'get'
    })
  },

  /**
   * 更新配置信息
   * @param {Object} data
   */
  UpdateConfigs(data) {
    return axios({
      url: '/config/updateConfig',
      method: 'post',
      data
    })
  }
})
