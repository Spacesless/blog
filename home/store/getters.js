const getters = {
  isSupportWebp: state => state.isSupportWebp,
  menus: state => state.menus,
  configs: state => state.configs,
  device: state => state.device,
  sidebar: state => state.tools.sidebar,
  particleActive: state => state.tools.particleActive,
  live2dShow: state => state.tools.live2dShow
}
export default getters
