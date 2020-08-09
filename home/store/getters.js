const getters = {
  sidebar: state => state.sidebar,
  device: state => state.device,
  isSupportWebp: state => state.isSupportWebp,
  menus: state => state.menus,
  configs: state => state.configs,
  bubbleActive: state => state.tools.bubbleActive,
  live2dShow: state => state.tools.live2dShow
}
export default getters
