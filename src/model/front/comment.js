module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Array}
   */
  async selectComment({ topic_id: topicId, page, pageSize }) {
    // 查询主评论
    const field = 'id,topic_id,parent_id,reply_name,type,name,email,website,content,addtime,is_admin';
    const list = await this.model('comment')
      .field(field)
      .where({ topic_id: topicId, type: 1, is_show: 1 })
      .order('addtime DESC')
      .page(page, pageSize)
      .select();
    // 查询回复
    const parentIds = list.map(item => item.id);
    let replyList = [];
    if (parentIds.length) {
      replyList = await this.model('comment')
        .field(field)
        .where({
          is_show: 1,
          parent_id: ['IN', parentIds]
        })
        .order('addtime DESC')
        .select();
    }

    return [...list, ...replyList];
  }
};
