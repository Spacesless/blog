import request from '@/utils/request'

// 清除缓存
export function RefreshCache() {
  return request({
    url: '/index/refresh',
    method: 'get'
  })
}

/**
 * 上传文件
 * @param {Array [binary]} files 文件对象，可多选
 */
export function UploadFiles(formData) {
  return request({
    url: '/file/post',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData
  })
}

/**
 * 获取上传文件列表
 * @param {Object} query 查询条件
 */
export function GetPathList(query) {
  return request({
    url: '/file/get',
    method: 'get',
    params: query
  })
}
