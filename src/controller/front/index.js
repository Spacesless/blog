const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg);
    this.modelInstance = this.model('front/index');
  }

  async indexAction() {
    const configs = await this.getConfigs();
    const {
      home_article_num: articleNum,
      home_bangumi_num: bangumiNum
    } = configs;

    // 正在做 banner
    const bannerList = await this.modelInstance.selectBanner();
    for (const element of bannerList) {
      element.imgurl = this.getAbsolutePath(element.imgurl);
    }

    // 最新动态文章
    const articleList = await this.modelInstance.selectArticle(articleNum);

    for (const element of articleList) {
      const { description } = element;
      element.description = description.substr(0, 80);
    }

    // 最新追番
    let bangumiList = await this.modelInstance.selectBangumi(bangumiNum);

    const postService = this.service('post', 'bangumi', configs);
    bangumiList = await postService.formatList(bangumiList, item => {
      const { imgurl, description } = item;
      item.imgurl = this.getAbsolutePath(imgurl);
      item.description = description.substr(0, 60);
    });

    return this.success({
      bannerList,
      articleList,
      bangumiList
    });
  }
};
