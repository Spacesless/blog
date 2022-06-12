const Base = require('./base.js');

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
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
    const { article_num: pageSize } = configs;
    const childCategories = await this.model('category').findChildCategory(categories, findCategory.id);
    const query = {
      ...req,
      pageSize,
      childCategories
    };

    const [list, commentGroup] = await Promise.all([
      this.model('front/article').selectPost(query),
      this.model('front/comment').groupComment()
    ]);

    // 评论数量
    const commentCount = commentGroup.reduce((prev, curr) => {
      prev[curr.topic_id] = curr.count;
      return prev;
    }, {});

    // 转换列表
    const postService = this.service('post', 'article', configs);
    list.data = await postService.formatList(list.data, item => {
      const { imgurl, description, tag } = item;
      item.imgurl = this.getAbsolutePath(imgurl);
      item.description = description.substr(0, 80);
      item.tag = tag ? tag.split('|') : [];
      item.comment_count = commentCount['article-' + item.id] || 0;
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

  // 增加访问量
  accessAction() {
    const { id } = this.get();
    // 访问量+1
    this.modelInstance.where({ id })
      .increment('hits', 1);
    return this.success();
  }

  // 推荐阅读
  async sameAction() {
    const { id, categoryId, tags } = this.get();

    const list = await this.model('front/article').samePost({ id, categoryId, tags });

    list.forEach(item => {
      const { description } = item;
      item.description = description.substr(0, 60);
    });

    return this.success(list);
  }
};
