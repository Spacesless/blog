/* eslint-disable */
const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    // 主导航信息
    const configs = await this.getConfigs();
    const categories = await this.getCategory();

    // 配置信息
    const {
      sitename, is_silent, live2d_model, live2d_texture, icp_beian, police_beian,
      article_width, article_height,
      bangumi_width, bangumi_height
    } = configs;
    const targetConfigs = {
      siteurl: this.siteurl,
      currentYear: new Date().getFullYear(),
      timeless: Math.ceil((new Date() - new Date('2018/03/15')) / 86400000),
      police_beian_code: police_beian ? police_beian.replace(/[^0-9]/ig, '') : '',
      sitename,
      is_silent,
      live2d_model,
      live2d_texture,
      icp_beian,
      police_beian,
      article_width,
      article_height,
      bangumi_width,
      bangumi_height
    };

    return this.success({
      categories,
      configs: targetConfigs
    });
  }
};
