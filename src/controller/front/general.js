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
      sitename, keywords, description,
      is_silent, live2d_model, live2d_texture, icp_beian, police_beian,
      article_width, article_height, bangumi_width, bangumi_height
    } = configs;
    const runDays = Math.ceil((new Date() - new Date('2018/04/25')) / 86400000)
    const duration = `${Math.floor(runDays / 365)}年${runDays % 365}天`

    const targetConfigs = {
      siteurl: this.siteurl,
      currentYear: new Date().getFullYear(),
      duration,
      keywords,
      description,
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
