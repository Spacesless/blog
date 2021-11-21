const Rest = require('../rest');

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      // banner 详情
      const data = await this.modelInstance.where({ id: this.id }).find();
      data.imgurl = this.getAbsolutePath(data.imgurl);
      return this.success(data);
    } else {
      // banner 列表
      const field = 'id,title,imgurl,sort,is_show';
      const list = await this.modelInstance
        .field(field)
        .order('sort ASC')
        .select();

      list.forEach(item => {
        item.imgurl = this.getAbsolutePath(item.imgurl);
      });

      return this.success(list);
    }
  }

  // 添加banner
  async postAction() {
    const data = this.post();
    const { imgurl } = data;
    if (imgurl) data.imgurl = imgurl.replace(this.siteurl, '');
    const insertId = await this.modelInstance.add(data);

    if (insertId) {
      return this.success();
    } else {
      return this.fail();
    }
  }

  // 更新banner
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
    const { imgurl } = data;
    if (imgurl) data.imgurl = imgurl.replace(this.siteurl, '');
    const affectedRows = await this.modelInstance.where({ id: this.id }).update(data);
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

    const affectedRows = await this.modelInstance.where({ id: ['IN', list] }).delete();
    if (affectedRows) {
      return this.success();
    } else {
      return this.fail();
    }
  }
};
