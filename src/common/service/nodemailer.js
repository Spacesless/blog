const nodemailer = require('nodemailer');

module.exports = class extends think.Service {
  constructor(config) {
    super();

    const transport = {
      host: config.email_smtp, // 邮件服务器地址
      port: config.email_port, // 邮件服务器端口
      secure: config.email_way, // true for 465, false for other ports
      auth: {
        user: config.email_usename, // 发送端用户名
        pass: config.email_auth // 发送端authorization code, 一般不用密码
      }
    };

    this.transporter = nodemailer.createTransport(transport);
  }

  /**
   * 发送电子邮件
   * @param {String} from 发送人
   * @param {String} to 收件人列表，逗号分隔
   * @param {String} subject 邮件主题
   * @param {String} text plain text 内容
   * @param {Document} html html 内容
   * @returns {Function} Promise
   */
  sendMail(options) {
    return this.transporter.sendMail(options);
  }
};
