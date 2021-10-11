const Base = require('./base.js');
const moment = require('moment');

module.exports = class extends Base {
  async indexAction() {
    const { topic_id: topicId, page, pageSize } = this.get();
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

    const allComment = [...list, ...replyList];
    const treeData = this.convertToTree(allComment);

    return this.success({
      total: allComment.length,
      data: treeData
    });
  }

  /**
   * 提交评论
   * @summary 支持功能如下
   * XSS过滤
   * 重复内容检测
   * 基于 IP 的发布评论频率限制
   */
  async postAction() {
    let IP = this.ctx.ip;
    IP = IP.indexOf('::ffff:') === 0 ? IP.substring(7) : IP;

    const data = this.post();

    // 重复内容检测
    const commentList = await this.model('comment')
      .where({ ip: IP, parent_id: data.parent_id })
      .order('addtime DESC')
      .select();
    const isExist = commentList.find(item => item.content.includes(data.content));
    if (isExist) {
      return this.fail('请不要重复评论');
    }

    // 基于IP的发布评论频率限制
    const recentComment = commentList[0];
    if (recentComment && moment() - moment(recentComment.addtime) < 60 * 1000) {
      return this.fail('操作太频繁，请稍后再试试');
    }

    data.addtime = moment().format('YYYY-MM-DD HH:mm:ss');
    data.ip = IP;
    const result = await this.model('comment')
      .add(data);

    if (result) return this.success();
    else return this.fail('遇到一个无法处理的问题');
  }
};
