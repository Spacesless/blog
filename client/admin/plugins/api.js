import apis from '@/api/index'

export default (ctx, inject) => {
  var apiList = {}
  for (var i in apis) {
    apiList[i] = apis[i](ctx.$axios)
  }

  // 文档: https://www.nuxtjs.cn/guide/plugins
  // inject:注入到服务端context, vue实例, vuex中
  inject('api', apiList)
}
