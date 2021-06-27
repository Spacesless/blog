const Rest = require('../rest');

module.exports = class extends Rest {
  // 查询文章
  async getAction() {
    if (this.id) {
      // 文章详情
      const data = await this.modelInstance.where({ id: this.id }).find();
      data.imgurl = this.getResolveImgUrl(data.imgurl);
      data.content = this.getResolveContentUrl(data.content);
      return this.success(data);
    } else {
      // 文章列表
      const { keyword, category, page, pageSize } = this.get();

      const where = { is_recycle: 0 };
      if (keyword) {
        where.title = ['like', `%${keyword}%`];
      }
      if (category) {
        // 筛选栏目
        const categorys = await this.model('category').getCategory();
        const categoryId = parseInt(category);
        const findCategory = await this.model('category', {}, 'common').getChildrenCategory(categorys, categoryId);
        where.category_id = ['IN', findCategory];
      }

      const field = 'id,title,imgurl,hits,updatetime,is_show';
      const list = await this.modelInstance.where(where)
        .field(field)
        .order('updatetime DESC')
        .page(page, pageSize)
        .countSelect();

      // 裁剪缩略图
      const configs = await this.model('config').getConfig();
      const { thumb_kind: fit, thumb_article_x: width, thumb_article_y: height } = configs;
      const { data } = list;
      for (const item of data) {
        const { imgurl } = item;
        item.imgurl = await this.thumbImage(imgurl, width, height, fit);
      }
      list.data = data;

      return this.success(list);
    }
  }

  // 添加文章
  async postAction() {
    const data = this.post();
    const insertId = await this.modelInstance.addContent(data, this.siteurl);

    if (insertId) {
      return this.success();
    } else {
      return this.fail();
    }
  }

  // 更新文章
  async putAction() {
    // 列表页更新
    const list = this.post('list');
    if (list) {
      const rows = await this.modelInstance.updateMany(list);
      if (rows) {
        return this.success();
      } else {
        return this.fail();
      }
    }

    // 详情更新
    if (!this.id) {
      return this.fail('CONTENT_NOT_EXIST');
    }
    const data = this.post();
    const row = await this.modelInstance.updateContent(this.id, data, this.siteurl);

    if (row) {
      return this.success();
    } else {
      return this.fail();
    }
  }

  // 删除文章
  async deleteAction() {
    const list = this.post('list');
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const data = list.map(item => {
      return {
        id: item,
        updatetime: new Date(),
        is_recycle: 1
      };
    });
    const rows = await this.modelInstance.updateMany(data);

    if (rows) {
      return this.success();
    } else {
      return this.fail();
    }
  }
};
