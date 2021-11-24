/* eslint-disable */
const Base = require('./base.js');

/**
 * 清除值为空的属性
 * @param {Object} obj
 */
 function removeEmpty(obj) {
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value === '' || value == null) {
      delete obj[key];
    }
  })
}

module.exports = class extends Base {
  async indexAction() {
    // 主导航信息

    const [configs, categories] = await Promise.all([
      this.getConfigs(),
      this.getCategory()
    ]).catch(() => {
      return this.fail()
    })

    // 清除值为空的字段
    categories.forEach(item => removeEmpty(item))

    // 配置信息
    const {
      sitename, is_silent, live2d_model, live2d_texture, icp_beian, police_beian,
      article_width, article_height, bangumi_width, bangumi_height
    } = configs;
    const targetConfigs = {
      siteurl: this.siteurl,
      currentYear: new Date().getFullYear(),
      duration: Math.ceil((new Date() - new Date('2018/03/15')) / 86400000),
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
