const Rest = require('../rest');

module.exports = class extends Rest {
  // 查询番剧
  async getAction() {
    if (this.id) {
      // 番剧详情
      const data = await this.modelInstance.where({ id: this.id }).find();
      data.imgurl = this.getAbsolutePath(data.imgurl);
      data.content = this.getContentAbsolutePath(data.content);
      return this.success(data);
    } else {
      // 番剧列表
      const query = this.get();

      const list = await this.modelInstance.selectPost(query);

      const configs = await this.model('config').getCacheConfig();
      const { image_fit: fit, bangumi_width: width, bangumi_height: height } = configs;
      const { data } = list;
      for (const item of data) {
        const { imgurl } = item;
        item.imgurl = await this.getThumbnail(imgurl, width, height, fit);
      }
      list.data = data;
      return this.success(list);
    }
  }

  // 添加番剧
  async postAction() {
    const data = this.post();
    const insertId = await this.modelInstance.createPost(data, this.siteurl);

    if (insertId) {
      return this.success();
    } else {
      return this.fail();
    }
  }

  // 更新番剧
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
    const row = await this.modelInstance.updatePost(this.id, data, this.siteurl);

    if (row) {
      return this.success();
    } else {
      return this.fail();
    }
  }

  async deleteAction() {
    const list = this.post('list');
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const rows = await this.modelInstance.deletePost(list);

    if (rows) {
      return this.success();
    } else {
      return this.fail();
    }
  }
};
