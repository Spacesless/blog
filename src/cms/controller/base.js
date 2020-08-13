module.exports = class extends think.Controller {
  async __before() {
    const { controller } = this.ctx
    if (controller === 'admin') {
      return
    }

    const userInfo = await this.session('userInfo') || {}
    if (think.isEmpty(userInfo)) {
      return this.fail(401, '未授权，请登录后再操作！')
    }

    this.siteurl = this.ctx.origin.replace(/http:|https:/, '')
  }

  async __call() {
    if (!this.isAjax()) {
      return this.display('admin/index')
    }
  }
}
