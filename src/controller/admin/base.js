module.exports = class extends think.Controller {
  async __before() {
    // 无需鉴权的白名单
    const { controller, action } = this.ctx;
    const whiteController = ['admin/user'];
    const whiteAction = ['login', 'forgot', 'reset', 'captcha'];
    if (whiteController.includes(controller) && whiteAction.includes(action)) {
      return;
    }

    // Session-Cookie鉴权
    const userInfo = await this.session('userInfo');
    if (think.isEmpty(userInfo)) {
      return this.fail(401, '请登录后再操作！');
    }
  }
};
