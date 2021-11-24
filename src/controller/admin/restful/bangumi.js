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
      return this.listAction();
    }
  }

  // 番剧列表
  async listAction() {
    const query = this.get();

    const list = await this.modelInstance.selectPost(query);

    // 转换列表
    const postService = this.service('post', 'bangumi');
    list.data = await postService.formatList(list.data, item => {
      item.imgurl = this.getAbsolutePath(item.imgurl);
    });

    return this.success(list);
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
      if (!list.length) {
        return this.fail('CONTENT_NOT_EXIST');
      }

      const affectedRows = await this.modelInstance.updateMany(list);
      if (affectedRows) {
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
    const affectedRows = await this.modelInstance.updatePost(this.id, data, this.siteurl);

    if (affectedRows) {
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

    const affectedRows = await this.modelInstance.deletePost(list);

    if (affectedRows) {
      return this.success();
    } else {
      return this.fail();
    }
  }
};
