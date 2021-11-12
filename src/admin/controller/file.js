const Base = require('./base');

// 允许上传文件格式
const ALLOW_EXTS = [
  /** 图片文件 */
  /\.(gif|jpe?g|png|webp|tiff|bmp|ico)$/i,
  /** 多媒体文件 */
  /\.(mp3|wmv|mp4|avi|flv)$/i,
  /** 常用档案文件 */
  /\.(txt|xml|json|docx?|xlsx?|pptx?)$/i,
  /\.(zip|rar|pdf|gz)$/i
];

module.exports = class extends Base {
  constructor(...args) {
    super(...args);
    this.uploadConfig = {};
  }

  async __before() {
    await super.__before();
    try {
      /**
       * 文件操作
       * @param {String} service 本地
       */
      const service = 'local'; // TODO 腾讯云COS
      this.fileHelper = think.service(`upload/${service}`, 'admin', this.siteurl);
    } catch (e) {
      return this.fail(e.message || 'FILE_SERVICES_ERROR');
    }
  }

  // 获取文件列表
  async getAction() {
    const { path, page, pageSize, keyword } = this.get();
    const result = await this.fileHelper.getFileList(keyword, path, page, pageSize);
    return this.success(result);
  }

  // 文件上传
  async postAction() {
    let filelist = this.file('file');

    if (!think.isArray(filelist)) {
      filelist = [filelist];
    }
    const promises = [];
    filelist.forEach(item => {
      if (!item) { return this.fail('FILE_UPLOAD_ERROR') }
      /** 检查文件类型 */
      const ext = this.extWhiteList(item);
      if (!ext) {
        return this.fail('FILE_FORMAT_NOT_ALLOWED');
      }
      const step = this.fileHelper.upload(item);
      promises.push(step);
    });

    let fileUrls;
    await Promise.all(promises).then(result => {
      fileUrls = [...result];
    });
    return this.success(fileUrls);
  }

  // MIME过滤
  extWhiteList(file) {
    return ALLOW_EXTS.some(reg => reg.test(file.name));
  }
};
