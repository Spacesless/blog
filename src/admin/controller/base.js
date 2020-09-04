module.exports = class extends think.Controller {
  async __before() {
    const { controller } = this.ctx
    const whiteList = ['user'] // 无需鉴权的白名单
    if (whiteList.includes(controller)) {
      return
    }

    const userInfo = await this.session('userInfo')
    if (think.isEmpty(userInfo)) {
      return this.fail(401, '请登录后再操作！')
    }

    this.siteurl = this.ctx.origin.replace(/http:|https:/, '')
  }
}
