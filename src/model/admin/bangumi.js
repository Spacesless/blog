const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 新增番剧
   * @param {Object} data 番剧信息
   * @param {String} siteurl 网站地址
   */
  async addContent(data, siteurl) {
    const { imgurl, content } = data;
    if (imgurl) data.imgurl = this.getRelativeImgUrl(imgurl, siteurl);
    if (content) data.content = this.getRelativeContentUrl(content, siteurl);
    const insertId = await this.add(data);
    return insertId;
  }

  /**
   * 更新番剧
   * @param {Object} data 番剧信息
   * @param {String} siteurl 网站地址
   */
  async updateContent(id, data, siteurl) {
    const { imgurl, content } = data;
    if (imgurl) data.imgurl = this.getRelativeImgUrl(imgurl, siteurl);
    if (content) data.content = this.getRelativeContentUrl(content, siteurl);
    const result = await this.where({ id }).update(data);
    return result;
  }

  /**
   * 永久删除文章
   * @param {Number} id 文章ID
   */
  async foreverDelete(id) {
    const row = await this.where({ id }).find();
    if (think.isEmpty(row)) return {};
    // // 删除数据
    const result = await this.where({ id }).delete();
    return result;
  }
};
