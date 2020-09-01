module.exports = class extends think.Controller {
  indexAction() {
    return this.display('../www/cms/index')
  }
}
