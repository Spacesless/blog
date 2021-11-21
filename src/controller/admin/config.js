const Base = require('./base');

module.exports = class extends Base {
  constructor() {
    super();
    this.modelInstance = this.model('admin/config');
  }

  async getConfigAction() {
    const configs = await this.modelInstance.getConfig();
    configs.siteurl = this.siteurl;
    return this.success(configs);
  }

  async updateConfigAction() {
    const data = this.post();
    const rows = await this.modelInstance.updateConfig(data);
    if (rows) {
      return this.success('更新成功');
    } else {
      return this.fail('更新失败');
    }
  }
};
