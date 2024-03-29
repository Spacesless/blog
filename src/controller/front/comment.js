const xss = require('xss');
const moment = require('moment');
const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const req = this.get();

    const list = await this.model('front/comment').selectComment(req);

    return this.success({
      total: list.length,
      data: list
    });
  }

  /**
   * 提交评论
   * @summary 支持功能如下
   *   XSS过滤
   *   重复内容检测
   *   基于 IP 的发布评论频率限制
   *   发送邮件通知
   */
  async postAction() {
    const data = this.post();

    let IP = this.ctx.ip;
    IP = IP.indexOf('::ffff:') === 0 ? IP.substring(7) : IP;

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

    // XSS过滤
    data.content = xss(data.content, {
      whiteList: {
        img: ['class', 'src']
      }
    });

    data.addtime = moment().format('YYYY-MM-DD HH:mm:ss');
    data.ip = IP;

    const insertId = await this.model('comment').add(data);

    if (insertId) {
      // 发送邮件通知
      const Nodemailer = think.service('nodemailer');
      Nodemailer.sendMail({
        from: '18878554196@163.com',
        to: '804093032@qq.com',
        subject: '网站收到留言啦',
        html: `
          <p>页面标题：${data.topic_title}</p>
          <p>昵称：${data.name}</p>
          <p>邮箱：${data.email}</p>
          <p>网址：${data.website || ''}</p>
          <p>评论内容：${data.content}</p>
        `
      });
      return this.success();
    } else {
      return this.fail('遇到一个无法处理的问题');
    }
  }
};
