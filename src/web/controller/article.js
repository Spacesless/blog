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
    const { list_article: pageSize, thumb_article_x: width, thumb_article_y: height, thumb_kind: fit } = configs;

    const field = 'id,title,description,imgurl,updatetime,hits,tag';
    const sort = sortBy || 'updatetime';
    const order = orderBy ? orderBy.toUpperCase() : 'DESC';

    const where = { is_show: 1, is_recycle: 0 };
    const findCategory = await this.model('category').getChildrenCategory(categorys, category.id);
    where.category_id = ['IN', findCategory];
    // tag标签
    if (tags) where.tag = ['like', tags.split(',').map(item => `%${item}%`)];

    const list = await this.modelInstance
      .where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect();

    for (const item of list.data) {
      const { imgurl, tag } = item;
      item.description = this.substr(item.description, 0, 80);
      item.width = width;
      item.height = height;
      item.imgurl = await this.getThumbnail(imgurl, width, height, fit);
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
    const { thumb_article_x: width, thumb_article_y: height, thumb_kind: fit } = configs;
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
