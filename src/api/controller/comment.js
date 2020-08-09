const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const { id, page, pageSize } = this.get();
    // 查询主评论
    const list = await this.model('comment')
      .where({ page_id: id, is_reply: 0 })
      .page(page, pageSize)
      .select()
    // 查询回复
    const parentIds = list.map(item => item.id)
    const replyList = await this.model('comment')
      .where({
        parentId: ['IN', parentIds]
      })
      .select()

    const treeData = this.convertToTree([...list, ...replyList])

    return this.success(treeData);
  }

  async postAction() {
    let result;
    const data = this.post();

    const { ip, content } = data;
    const isExist = await this.model('message')
      .where({ ip, content: ['like', '%content%'] })
      .select();
    if(isExist) {
      return this.fail()
    } else {
      result = await this.model('comment')
        .add(data);
    }

    if (result) return this.success();
    else return this.fail();
  }
};
