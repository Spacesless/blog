const getters = {
  sidebar: state => state.sidebar,
  device: state => state.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  categorys: state => state.list.categorys,
  configs: state => state.config.configs,
  updateRoute: state => state.list.updateRoute
}
export default getters
