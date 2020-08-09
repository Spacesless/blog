import request from '@/utils/request'

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

export function GetPathList(query) {
  return request({
    url: '/file/get',
    method: 'get',
    params: query
  })
}