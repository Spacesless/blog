module.exports = class extends think.Controller {
  indexAction() {
    // 后台admin vue-cli生成的首页
    return this.display('../www/admin/index')
  }
}
