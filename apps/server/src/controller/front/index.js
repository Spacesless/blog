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
    const articleService = this.service('post', 'article', configs);
    const formatArticleList = await articleService.formatList(articleList, item => {
      const { imgurl, description } = item;
      item.imgurl = this.getAbsolutePath(imgurl);
      item.description = description.substr(0, 150);
    });

    // 最新追番
    const bangumiService = this.service('post', 'bangumi', configs);
    const formatBangumiList = await bangumiService.formatList(bangumiList, item => {
      const { imgurl, description } = item;
      item.imgurl = this.getAbsolutePath(imgurl);
      item.description = description.substr(0, 60);
    });

    return this.success({
      bannerList,
      articleList: formatArticleList,
      bangumiList: formatBangumiList
    });
  }
};
