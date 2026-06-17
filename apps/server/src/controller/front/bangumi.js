const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.modelInstance = this.model('bangumi');
  }

  async listAction() {
    const req = this.get();
    const { id } = req;

    const categories = await this.getCategory();

    // 当前栏目
    let findCategory = {};
    if (!think.isEmpty(id)) {
      findCategory = categories.find(item => item.id === +id && item.type === 'bangumi');
      if (!findCategory) {
        return this.fail(404);
      }
    }

    // 当前列表
    const configs = await this.getConfigs();
    const { bangumi_num: pageSize } = configs;
    const childCategories = await this.model('category').findChildCategory(categories, findCategory.id);
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

    // 支持通过数字 id 或 slug(pathname) 查询
    const where = { is_recycle: 0, is_show: 1 };
    if (/^\d+$/.test(String(id))) {
      where.id = id;
    } else {
      where.pathname = id;
    }
    const data = await this.modelInstance.where(where).find();

    if (think.isEmpty(data)) {
      return this.fail(404);
    }

    const configs = await this.getConfigs();
    const { bangumi_width: width, bangumi_height: height, image_fit: fit } = configs;
    const postService = this.service('post');
    const imgurl = await postService.getThumbnail({
      width,
      height,
      fit,
      src: data.imgurl,
      isAsync: false
    });
    data.imgurl = this.getAbsolutePath(imgurl);
    data.content = this.getContentAbsolutePath(data.content);

    return this.success(data);
  }

  // 推荐阅读
  async sameAction() {
    const { id, categoryId, tags } = this.get();

    const list = await this.model('front/bangumi').samePost({ id, categoryId, tags });

    list.forEach(item => {
      const { description } = item;
      item.description = description.substr(0, 60);
    });

    return this.success(list);
  }
};
