const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('front/index');
  }

  async indexAction() {
    const configs = await this.getConfigs();
    const {
      home_article_num: articleNum,
      home_bangumi_num: bangumiNum
    } = configs;

    const [
      { value: bannerList = [] },
      { value: articleList = [] },
      { value: bangumiList = [] }
    ] = await Promise.allSettled([
      this.modelInstance.selectBanner(),
      this.modelInstance.selectArticle(articleNum),
      this.modelInstance.selectBangumi(bangumiNum)
    ]);

    // banner
    for (const element of bannerList) {
      element.imgurl = this.getAbsolutePath(element.imgurl);
    }

    // 最新动态文章
    for (const element of articleList) {
      const { description } = element;
      element.description = description.substr(0, 80);
    }

    // 最新追番
    const postService = this.service('post', 'bangumi', configs);
    const formatBangumiList = await postService.formatList(bangumiList, item => {
      const { imgurl, description } = item;
      item.imgurl = this.getAbsolutePath(imgurl);
      item.description = description.substr(0, 60);
    });

    return this.success({
      bannerList,
      articleList,
      bangumiList: formatBangumiList
    });
  }
};
