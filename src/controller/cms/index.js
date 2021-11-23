module.exports = class extends think.Controller {
  indexAction() {
    // 后台admin 展示生成的单页
    return this.display('../www/admin/index');
  }
};
