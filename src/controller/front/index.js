const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const configs = await this.getConfigs();
    const categorys = await this.getCategory();

    const { title, keywords, description } = configs;
    const seo = {
      title,
      keywords,
      description
    };

    // 正在做 banner
    // const { banner_width: bannerWidth, banner_height: bannerHeight, image_fit: fit } = configs;
    const bannerField = 'id,imgurl,title';
    const bannerList = await this.model('banner')
      .field(bannerField)
      .where({ is_show: 1 })
      .order('sort ASC')
      .select();
    for (const element of bannerList) {
      element.imgurl = await this.getAbsolutePath(element.imgurl);
    }

    // 最新动态文章
    const articleField = 'id,imgurl,title,description,category_id,hits,updatetime';
    const articleWhere = { is_show: 1, is_recycle: 0 };
    const articleList = await this.model('article')
      .field(articleField)
      .where(articleWhere)
      .limit(8)
      .order('updatetime DESC')
      .select();

    for (const element of articleList) {
      const { category_id: categoryId, description } = element;
      element.description = description.substr(0, 80);
      const currentCategory = categorys.find(item => item.id === categoryId);
      const folder = currentCategory ? currentCategory.type : 'article';
      element.column = {
        name: currentCategory.name,
        url: `/${folder}/${currentCategory.id}`
      };
    }

    // 最新追番
    const bangumiField = 'id,title,description,total,current,imgurl,showtime,status';
    const bangumiWhere = { is_show: 1, is_recycle: 0, status: ['!=', 0], current: ['EXP', '< `total`'] };
    const bangumiList = await this.model('bangumi')
      .field(bangumiField)
      .where(bangumiWhere)
      .limit(6)
      .order('updatetime DESC')
      .select();

    const { bangumi_width: bangumiWidth, bangumi_height: bangumiHeight, image_fit: fit } = configs;
    for (const element of bangumiList) {
      const { description, imgurl } = element;
      element.description = description.substr(0, 60);
      element.imgurl = await this.getThumbnail(imgurl, bangumiWidth, bangumiHeight, fit);
    }

    return this.success({
      seo,
      bannerList,
      articleList,
      bangumiList
    });
  }
};
