const moment = require('moment');
const Rest = require('../rest');

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ id: this.id }).find();

      if (data.parent_id) {
        const replyData = await this.modelInstance.where({ id: data.parent_id }).find();
        data.replyData = replyData;
      }

      return this.success(data);
    } else {
      const { page, pageSize } = this.get();

      const list = await this.model('admin/comment').selectComment(page, pageSize);

      return this.success(list);
    }
  }

  // 回复评论
  async postAction() {
    const data = this.post();
    const insertData = {
      ...data,
      addtime: moment().format('YYYY-MM-DD HH:MM:ss'),
      is_admin: 1
    };
    const insertId = await this.modelInstance.add(insertData);

    if (insertId) {
      return this.success();
    } else {
      return this.fail();
    }
  }

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

    if (!this.id) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const data = this.post();
    const affectedRows = await this.modelInstance.where({ id: this.id }).update(data);

    if (affectedRows) {
      return this.success('更新成功');
    } else {
      return this.fail('更新失败');
    }
  }

  // 删除评论
  async deleteAction() {
    const list = this.post('list');
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const affectedRows = await this.model('admin/comment').deleteComment(list);

    if (affectedRows) {
      return this.success();
    } else {
      return this.fail();
    }
  }
};
