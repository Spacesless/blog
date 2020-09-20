import request from '@/utils/request'

/**
 * 获取分页列表数据
 * @param {String} controller 控制器
 * @param {Object} query 查询条件
 */
export function GetList(controller, query) {
  return request({
    url: `/restful/${controller}/`,
    method: 'get',
    params: query
  })
}

/**
 * 删除分页列表数据
 * @param {String} controller 控制器
 * @param {Array} list 所删除数据id集合
 */
export function DeleteList(controller, list) {
  return request({
    url: `/restful/${controller}/`,
    method: 'delete',
    data: {
      list
    }
  })
}

/**
 * 更新分页列表数据
 * @param {String} controller 控制器
 * @param {Array} list 更新数据集合
 */
export function UpdateList(controller, list) {
  return request({
    url: `/restful/${controller}/`,
    method: 'put',
    data: {
      list
    }
  })
}

/**
 * 查询回收站分页数据
 * @param {Object} query 查询条件
 */
export function GetRecycleList(query) {
  return request({
    url: '/recycle/getList',
    method: 'get',
    params: query
  })
}

/**
 * 还原回收站数据
 * @param {Array} list 所要还原的数据
 */
export function RestoreRecycleList(list) {
  return request({
    url: '/recycle/restore',
    method: 'post',
    data: {
      list
    }
  })
}

/**
 * 删除回收站数据
 * @param {Array} list 所要删除的数据
 */
export function DeleteRecyleList(list) {
  return request({
    url: '/recycle/delete',
    method: 'post',
    data: {
      list
    }
  })
}
