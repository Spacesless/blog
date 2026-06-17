const Base = require('./base.js');
const slugify = require('../../service/slugify.js');

module.exports = class extends Base {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Object}
   */
  async selectPost({ keyword, category, page, pageSize, ratings }) {
    const where = { is_recycle: 0 };
    if (keyword) {
      where.title = ['like', `%${keyword}%`];
    }
    if (category) {
      // 筛选栏目
      const categories = await this.model('admin/category').getCategory();
      const categoryId = parseInt(category);
      const childCategories = await this.model('category').findChildCategory(categories, categoryId);
      where.category_id = ['IN', childCategories];
    }

    const order = { updatetime: 'DESC' };
    const orderWhiteList = ['DESC', 'ASC'];
    if (ratings && orderWhiteList.includes(ratings)) {
      order.ratings = ratings;
    }

    const field = 'id,title,imgurl,total,current,status,ratings,is_show,pathname';
    const list = await this.where(where)
      .field(field)
      .order(order)
      .page(page, pageSize)
      .countSelect();

    return list;
  }

  /**
   * 解析并确保 pathname 唯一
   * @param {Object} data 番剧数据（含 title, pathname）
   * @param {Number|String} [excludeId] 更新时排除自身
   * @returns {Promise<String>}
   */
  async resolvePathname(data, excludeId) {
    const inputPath = (data.pathname || '').trim();
    if (inputPath) {
      const base = slugify.toSlug(inputPath);
      if (!base) {
        return slugify.generateSlug({
          model: this,
          title: data.title,
          fallbackPrefix: 'bangumi',
          fallbackId: excludeId,
          excludeId
        });
      }
      return slugify.ensureUniqueSlug(this, base, excludeId);
    }
    return slugify.generateSlug({
      model: this,
      title: data.title,
      fallbackPrefix: 'bangumi',
      fallbackId: excludeId,
      excludeId
    });
  }

  /**
   * 新增番剧
   * @param {Object} data 番剧信息
   * @param {String} siteurl 网站地址
   */
  async createPost(data, siteurl) {
    const { imgurl, content } = data;
    if (imgurl) data.imgurl = this.getRelativeImgUrl(imgurl, siteurl);
    if (content) data.content = this.getRelativeContentUrl(content, siteurl);
    data.pathname = await this.resolvePathname(data);
    const insertId = await this.add(data);
    if (!data.pathname || data.pathname === 'bangumi') {
      const finalSlug = await slugify.generateSlug({
        model: this,
        title: data.title,
        fallbackPrefix: 'bangumi',
        fallbackId: insertId,
        excludeId: insertId
      });
      await this.where({ id: insertId }).update({ pathname: finalSlug });
    }
    return insertId;
  }

  /**
   * 更新番剧
   * @param {Object} data 番剧信息
   * @param {String} siteurl 网站地址
   */
  async updatePost(id, data, siteurl) {
    const { imgurl, content } = data;
    if (imgurl) data.imgurl = this.getRelativeImgUrl(imgurl, siteurl);
    if (content) data.content = this.getRelativeContentUrl(content, siteurl);
    if (Object.prototype.hasOwnProperty.call(data, 'pathname') || Object.prototype.hasOwnProperty.call(data, 'title')) {
      data.pathname = await this.resolvePathname(data, id);
    }
    const result = await this.where({ id }).update(data);
    return result;
  }

  /**
   * 软删除
   * @param {Array} list
   * @returns {Array}
   */
  async deletePost(list) {
    const data = list.map(item => {
      return {
        id: item,
        updatetime: new Date(),
        is_recycle: 1
      };
    });
    const rows = await this.updateMany(data);

    return rows;
  }

  /**
   * 永久删除文章
   * @param {Number} id 文章ID
   */
  async deleteForever(id) {
    const row = await this.where({ id }).find();
    if (think.isEmpty(row)) return {};
    // // 删除数据
    const result = await this.where({ id }).delete();
    return result;
  }
};
