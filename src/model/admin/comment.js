module.exports = class extends think.Model {
  /**
   * 查询评论列表
   * @param {Number} page
   * @param {Number} pageSize
   * @returns {Promise}
   */
  selectComment(page, pageSize) {
    const field = 'id,parent_id,content,topic_url,topic_title,addtime,name,reply_name,type,is_show';

    return this.modelInstance
      .field(field)
      .order('addtime DESC')
      .page(page, pageSize)
      .countSelect();
  }

  /**
   * 删除评论
   * @param {Array} list
   * @returns {Promise}
   */
  async deleteComment(list) {
    const promises = [];

    for (const item of list) {
      const id = item.id;
      const isExist = await this.modelInstance.where({ id }).count('id');
      let step;
      if (isExist) {
        step = this.modelInstance.where({ id }).delete();
      }
      promises.push(step);
    }

    return Promise.all(promises);
  }
};
