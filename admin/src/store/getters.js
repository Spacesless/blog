const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  column: state => state.list.column,
  updateRoute: state => state.list.updateRoute,
  config: state => state.config.config
}
export default getters
