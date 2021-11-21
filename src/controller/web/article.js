const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg);
    this.modelInstance = this.model('article');
  }

  async listAction() {
    const { id, page, sortBy, orderBy, tags } = this.get();

    const configs = await this.getConfigs();
    const categorys = await this.getCategory();

    // 当前栏目
    const { category, seo } = this.getListInfo(id, categorys, configs);
    if (think.isEmpty(category)) {
      return this.ctx.throw(404);
    }

    // 当前列表
    const { list_article: pageSize, article_width: width, article_height: height, image_fit: fit } = configs;

    const field = 'id,title,description,imgurl,updatetime,hits,tag';
    const sort = sortBy || 'updatetime';
    const order = orderBy ? orderBy.toUpperCase() : 'DESC';

    const where = { is_show: 1, is_recycle: 0 };
    const childCategories = await this.model('category').findChildCategory(categorys, category.id);
    where.category_id = ['IN', childCategories];
    // tag标签
    if (tags) where.tag = ['like', tags.split(',').map(item => `%${item}%`)];

    const list = await this.modelInstance
      .where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect();

    const thumbnail = this.service('thumbnail', 'article', this, configs);
    list.data = await thumbnail.getThumbnail(list.data);

    for (const item of list.data) {
      const { description, tag } = item;
      item.description = this.substr(description, 0, 80);
      // item.imgurl = await this.getThumbnail(item.imgurl, width, height, fit);
      item.tag = tag ? tag.split('|') : [];
    }

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
