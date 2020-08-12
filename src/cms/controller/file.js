const fs = require('fs');
const dns = require('dns');
const path = require('path');
const { parse } = require('url');
const request = require('request');
const onFinish = require('on-finished');
const Base = require('./base');

const INTERNAL_AREAS = [
  ['10.0.0.0', '10.255.255.255'],
  ['172.16.0.0', '172.31.255.255'],
  ['192.168.0.0', '192.168.255.255'],
  ['127.0.0.1', '127.255.255.255']
];

function ip2long(ip) {
  const multi = [0x1000000, 0x10000, 0x100, 1];
  let longValue = 0;
  ip.split('.').forEach((part, i) => { longValue += part * multi[i] });
  return longValue;
}

const reqIns = request.defaults({
  strictSSL: false,
  rejectUnauthorized: false
});

const getFileContent = think.promisify(reqIns.get, reqIns);
const writeFileAsync = think.promisify(fs.writeFile, fs);
const unlinkAsync = think.promisify(fs.unlink, fs);
const lookupAsync = think.promisify(dns.lookup, dns);

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
      this.fileHelper = think.service(`upload/${service}`, 'cms', this.siteurl);
    } catch (e) {
      return this.fail(e.message || 'FILE_SERVICES_ERROR');
    }
  }

  async getAction() {
    const path = this.get('path') || 'upload/';
    const page = this.get('page') || 1;
    const pageSize = this.get('limit') || 20;
    const keyword = this.get('keyword') || null;
    const result = await this.fileHelper.getFileList(path, page, pageSize, keyword);
    return this.success(result);
  }

  // 文件上传
  async postAction() {
    let filelist;

    /** 处理远程抓取 **/
    if (this.post('fileUrl')) {
      try {
        filelist = await this.getUrlFile(this.post('fileUrl'));
      } catch (e) {
        return this.fail(e.message);
      }
    } else {
      filelist = this.file('file');
    }

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
      if (filelist.length === 1) {
        fileUrls = result[0];
      } else {
        fileUrls = [...result];
      }
    });
    return this.success(fileUrls);
  }

  async modifyAction() {
    const srcpath = this.post('srcpath') || '';
    const destpath = this.post('destpath') || '';
    const action = this.post('action');
    const result = await this.fileHelper.modifyDirFile(srcpath, destpath, action);
    if (think.isError(result)) {
      return this.fail(result.code);
    }
    return this.success();
  }

  // MIME过滤
  extWhiteList(file) {
    return ALLOW_EXTS.some(reg => reg.test(file.name));
  }

  // 获取上传设置
  async getUploadConfig() {
    const config = await this.model('config').getConfig();
    return config;
  }

  /**
   * 下载远程文件
   * @param {String} url 远程文件地址
   */
  async getUrlFile(url) {
    let { hostname } = parse(url);
    if (!/^\d+\.\d+\.\d+\.\d+/i.test(hostname)) {
      hostname = await lookupAsync(hostname);
    }
    const longIP = ip2long(hostname);
    for (let [start, end] of INTERNAL_AREAS) {
      start = ip2long(start);
      end = ip2long(end);
      if (longIP >= start && longIP <= end) {
        throw new Error('URL ILLEGAL');
      }
    }

    const response = await getFileContent({
      url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) Chrome/47.0.2526.111 Safari/537.36'
      },
      strictSSL: false,
      timeout: 1000,
      encoding: 'binary'
    }).catch(() => { throw new Error('UPLOAD_URL_ERROR') });

    if (response.headers['content-type'].indexOf('image') === -1) {
      throw new Error('UPLOAD_TYPE_ERROR');
    }

    const uploadDir = think.TMPDIR_PATH;
    if (!think.isDirectory(uploadDir)) {
      think.mkdir(uploadDir);
    }

    const uploadName = think.uuid(20) + path.extname(url);
    const uploadPath = path.join(uploadDir, uploadName);
    await writeFileAsync(uploadPath, response.body, 'binary');

    // after upload delete file
    onFinish(this.ctx.res, () =>
      think.isExist(uploadPath) && unlinkAsync(uploadPath)
    );

    return {
      name: path.basename(url),
      path: uploadPath,
      size: response.headers['content-length'],
      type: response.headers['content-type']
    };
  }
};
