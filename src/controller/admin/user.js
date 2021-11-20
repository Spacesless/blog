const Base = require('./base');

// session过期时间 = 记录登录状态?7天:1天
const rememberSessionOpt = {
  maxAge: 7 * 24 * 3600 * 1000
};
const normalSessionOpt = {
  maxAge: 24 * 3600 * 1000
};

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg);
    this.modelInstance = this.model('user');
  }

  /**
   * login 登录
   * @return {Object} { token: access_token, expires: 令牌有效期 }
   */
  async loginAction() {
    const { username, password, captcha, remember } = this.post();
    const userInfo = await this.modelInstance.where({ username: username }).find();
    // 校验验证码 不区分大小写
    const svgcaptcha = await this.session('captcha') || '';
    if (captcha.toUpperCase() !== svgcaptcha.toUpperCase()) {
      return this.fail('验证码不正确');
    }
    // 校验用户名
    if (think.isEmpty(userInfo)) {
      return this.fail('帐户不存在');
    }
    // 校验密码
    if (!this.modelInstance.checkPassword(userInfo, password)) {
      return this.fail('密码不正确');
    }
    const IP = this.ctx.ip;
    userInfo.login_ip = IP.indexOf('::ffff:') !== -1 ? IP.substring(7) : IP;
    await this.modelInstance.updateLoginInfo(userInfo);

    delete userInfo.password;
    const expires = remember ? rememberSessionOpt : normalSessionOpt;
    // const token = await this.session('userInfo', userInfo, expires) // jwt
    await this.session('userInfo', userInfo, expires);

    return this.success({ token: this.cookie('thinkjs'), expires });
  }

  /**
   * getInfo 获取登录用户的信息
   * @summary jwt 需要根据简要的userInfo，重新查数据库
   */
  async getInfoAction() {
    const userInfo = await this.session('userInfo') || {};
    return this.success(userInfo);
  }

  /**
   * logout 注销
   * @return {}
   */
  async logoutAction() {
    await this.session('userInfo', null);
    return this.success();
  }

  /**
   * 更新管理员账户的信息
   */
  async updateAction() {
    const data = this.post();
    const rows = await this.modelInstance.saveAdmin(data, this.ctx.ip);
    if (rows) {
      await this.session('userInfo', '');
      return this.success(rows);
    } else {
      return this.fail();
    }
  }

  // 生成图片验证码
  async captchaAction() {
    const options = this.get();
    const SvgHelper = think.service('captcha', options);
    const { text, data } = SvgHelper.createCaptcha();

    await this.session('captcha', text); // 将图片验证码存到session

    this.success(data);
  }
};
