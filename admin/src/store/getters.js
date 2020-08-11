const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  columns: state => state.list.columns,
  configs: state => state.config.configs,
  updateRoute: state => state.list.updateRoute
}
export default getters
