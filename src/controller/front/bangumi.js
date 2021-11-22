const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg);
    this.modelInstance = this.model('bangumi');
  }

  async listAction() {
    const req = this.get();
    const { id } = req;

    const configs = await this.getConfigs();
    const categorys = await this.getCategory();

    // 当前栏目
    let findCategory = {};
    if (!think.isEmpty(id)) {
      findCategory = categorys.find(item => item.id === +id);
    }
    if (think.isEmpty(findCategory)) {
      return this.ctx.throw(404);
    }

    // 当前列表
    const { list_bangumi: pageSize } = configs;
    const childCategories = await this.model('category').findChildCategory(categorys, findCategory.id);
    const query = {
      ...req,
      pageSize,
      childCategories
    };
    const list = await this.model('front/bangumi').selectPost(query);

    // 转换列表
    const postService = this.service('post', 'bangumi', configs);
    list.data = await postService.formatList(list.data, item => {
      const { imgurl, description, tag } = item;
      item.imgurl = this.getAbsolutePath(imgurl);
      item.description = description.substr(0, 60);
      item.tag = tag ? tag.split('|') : [];
    });

    return this.success(list);
  }

  async detailAction() {
    const { id } = this.get();
    if (!think.isInt(id)) {
      return this.ctx.throw(404);
    }

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

    return this.success(data);
  }
};
