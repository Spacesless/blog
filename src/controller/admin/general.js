const path = require('path');
const fs = require('fs-extra');
const Base = require('./base');
const readdirSync = think.promisify(fs.readdir, fs);

module.exports = class extends Base {
  async indexAction() {
    const mysql = await this.model('config').query('SELECT VERSION() as version');
    const data = {
      nodeVersion: process.versions.node,
      v8Version: process.versions.v8,
      platform: process.platform,
      thinkjsVersion: think.version,
      mysqlVersion: mysql[0].version
    };

    return this.success({
      version: data,
      count: {
        category: await this.model('category').count('id'),
        article: await this.model('article').count('id'),
        bangumi: await this.model('bangumi').count('id'),
        comment: await this.model('comment').count('id')
      }
    });
  }

  // 查询未查看的评论
  async commentAction() {
    const field = 'id,content,addtime';
    const list = await this.model('comment')
      .field(field)
      .where({ 'is_admin': 0 })
      .order('addtime DESC')
      .page(1, 5)
      .countSelect();
    return this.success(list);
  }

  // 清除缓存
  async refreshAction() {
    await this.cache('category', null);
    await this.cache('config', null);
    return this.success();
  }

  // 删除缩略图
  async clearThumbnailAction() {
    await this.cache('thumbnail', null);

    const filesAndDirs = await readdirSync(think.UPLOAD_PATH);
    for (const item of filesAndDirs) {
      const itempath = path.join(think.UPLOAD_PATH, item, 'thumb');
      think.rmdir(itempath, true);
    }
    return this.success();
  }
};
