const Rest = require('../rest');

module.exports = class extends Rest {
  // 查询文章
  async getAction() {
    if (this.id) {
      // 文章详情
      const data = await this.modelInstance.where({ id: this.id }).find();
      data.imgurl = this.getAbsolutePath(data.imgurl);
      data.content = this.getContentAbsolutePath(data.content);
      return this.success(data);
    } else {
      return this.listAction();
    }
  }

  // 文章列表
  async listAction() {
    const query = this.get();

    const list = await this.modelInstance.selectPost(query);

    // 转换列表
    const postService = this.service('post', 'article');
    list.data = await postService.formatList(list.data);

    return this.success(list);
  }

  // 添加文章
  async postAction() {
    const data = this.post();
    const insertId = await this.modelInstance.createPost(data, this.siteurl);

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

  // 删除文章
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
