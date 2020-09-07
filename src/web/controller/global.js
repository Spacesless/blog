const Base = require('./base.js')

module.exports = class extends Base {
  indexAction() {
    // 主导航信息
    const cloneColumn = JSON.parse(JSON.stringify(this.columns))
    const isNav = cloneColumn.filter(item => item.is_nav === 1)
    const navigation = this.convertToTree(isNav)
    // 配置信息
    const { sitename, is_silent, live2d_model, live2d_texture, icp_beian, police_beian } = this.options
    const configs = {
      siteurl: this.siteurl,
      currentYear: new Date().getFullYear(),
      timeless: Math.ceil((new Date() - new Date('2018/03/15')) / 86400000),
      police_beian_code: police_beian ? police_beian.replace(/[^0-9]/ig, '') : '',
      sitename,
      is_silent,
      live2d_model,
      live2d_texture,
      icp_beian,
      police_beian
    }
    return this.success({ navigation, configs })
  }

  async accessAction() {
    const { module, id } = this.post()
    const moduleEnum = ['', 'blog', 'image', 'bangumi']
    const hasModule = moduleEnum[+module] || null

    if (hasModule) {
      await this.model(hasModule)
        .where({ id })
        .increment('hits')
    }

    return this.success()
  }
}
