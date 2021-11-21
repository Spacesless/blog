const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg);
    this.modelInstance = this.model('article');
  }

  async listAction() {
    const req = this.get();
    const { id } = req;

    const configs = await this.getConfigs();
    const categorys = await this.getCategory();

    // 当前栏目
    const { category, seo } = this.getListInfo(id, categorys, configs);
    if (think.isEmpty(category)) {
      return this.ctx.throw(404);
    }

    // 当前列表
    const { list_article: pageSize } = configs;
    const childCategories = await this.model('category').findChildCategory(categorys, category.id);
    const query = {
      ...req,
      pageSize,
      childCategories
    };
    const list = await this.model('front/article').selectPost(query);

    // 转换列表
    const postService = this.service('post', 'article', configs);
    list.data = await postService.formatList(list.data, item => {
      const { imgurl, description, tag } = item;
      item.imgurl = this.getAbsolutePath(imgurl);
      item.description = description.substr(0, 80);
      item.tag = tag ? tag.split('|') : [];
    });

    return this.success({
      seo,
      category,
      list
    });
  }

  async detailAction() {
    const { id } = this.get();
    if (!think.isInt(+id)) {
      return this.ctx.throw(404);
    }

    const data = await this.modelInstance
      .where({ id, is_recycle: 0 })
      .find();

    if (think.isEmpty(data) || data.is_show === 0) {
      return this.ctx.throw(404);
    }

    const configs = await this.getConfigs();
    const categorys = await this.getCategory();

    const { category, seo } = this.getDetailInfo(data, categorys, configs);
    const { article_width: width, article_height: height, image_fit: fit } = configs;
    data.imgurl = await this.getThumbnail(data.imgurl, width, height, fit);
    data.content = await this.formatContent(data.content);

    return this.success({
      seo,
      category,
      content: data
    });
  }

  accessAction() {
    const { id } = this.get();
    // 访问量+1
    this.modelInstance.where({ id })
      .increment('hits', 1);
    return this.success();
  }
};