const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg);
    this.modelInstance = this.model('article');
  }

  async listAction() {
    const req = this.get();
    const { id } = req;

    const categories = await this.getCategory();

    // 当前栏目
    let findCategory = {};
    if (!think.isEmpty(id)) {
      findCategory = categories.find(item => item.id === +id);
      if (!findCategory) {
        return this.ctx.throw(404);
      }
    }

    // 当前列表
    const configs = await this.getConfigs();
    const { list_article: pageSize } = configs;
    const childCategories = await this.model('category').findChildCategory(categories, findCategory.id);
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

    return this.success(list);
  }

  async detailAction() {
    const { id } = this.get();

    const data = await this.modelInstance
      .where({
        id,
        is_recycle: 0,
        is_show: 1
      })
      .find();

    if (think.isEmpty(data)) {
      return this.ctx.throw(404);
    }

    const configs = await this.getConfigs();
    const { article_width: width, article_height: height, image_fit: fit } = configs;
    const postService = this.service('post');
    data.imgurl = await postService.getThumbnail({
      width,
      height,
      fit,
      src: data.imgurl,
      isAsync: false
    });
    data.content = this.getContentAbsolutePath(data.content);

    return this.success(data);
  }

  accessAction() {
    const { id } = this.get();
    // 访问量+1
    this.modelInstance.where({ id })
      .increment('hits', 1);
    return this.success();
  }
};
