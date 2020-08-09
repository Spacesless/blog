const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const data = this.post();
    const { captcha, type, content } = data;
    // 校验验证码 不区分大小写
    const svgcaptcha = await this.session('feedbackCaptcha') || '';
    if (think.isEmpty(captcha) || captcha.toUpperCase() !== svgcaptcha.toUpperCase()) {
      return this.fail('验证码不正确');
    }
    let IP = this.ctx.ip;
    IP = IP.indexOf('::ffff:') !== -1 ? IP.substring(7) : IP
    const exists = await this.model('message')
      .where({ ip: IP })
      .select();

    // TODO 改IP刷的过滤暂时做
    if (exists.length) {
      // 检测是否有重复提交，判断标准类型相同、内容包含
      const findSameMessage = exists.find(item => item.type === type && item.content.includes(content))
      if(findSameMessage) return this.fail('请不要重复提交，处理不过来的！');
      // 检测同一IP 2次提交间隔
      const lastRecord = exists[exists.length - 1]
      const postDistance = new Date().getTime() - new Date(lastRecord.addtime).getTime()
      const waitTime = 5 * 60 * 1000 - postDistance // 需大于5分钟
      if(waitTime > 0) {
        return this.fail(`请 ${Math.ceil(waitTime / 1000)} 秒后再来提交呗`);
      }
    }

    const addData = {...data, ...{
      ip: IP,
      addtime: think.datetime()
    }}
    const influenceRow = await this.model('message').add(addData);
    if (influenceRow) return this.success('提交成功');
    else return this.fail('提交失败');
  }

  async captchaAction() {
    const options = this.get();
    const Svg = think.service('captcha', 'common', options);
    const { text, data } = Svg.createCaptcha();
    await this.session('feedbackCaptcha', text);
    this.success(data);
  }
};
