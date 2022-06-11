export default axios => ({
  // 清除缓存
  RefreshCache (data) {
    return axios.get('/general/refresh')
  },

  // 清除缩略图
  ClearThumbnail () {
    return axios.get('/general/clearThumbnail')
  },

  /**
   * 上传文件
   * @param {Array [binary]} files 文件对象，可多选
   */
  UploadFiles (formData) {
    return axios({
      url: '/file/post',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData
    })
  },

  /**
   * 获取上传文件列表
   * @param {Object} query 查询条件
   */
  GetPathList (query) {
    return axios({
      url: '/file/get',
      method: 'get',
      params: query
    })
  },

  /**
   * 获取图片验证码
   * @param {Object} params 图片验证码参数
   * @returns {Element} svg图片
   */
  GetCaptcha (params) {
    return axios({
      url: '/user/captcha',
      method: 'get',
      params
    })
  }
})
