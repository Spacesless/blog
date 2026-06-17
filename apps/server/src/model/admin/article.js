const Base = require('./base.js');
const slugify = require('../../service/slugify.js');

module.exports = class extends Base {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Object}
   */
  async selectPost({ keyword, category, page, pageSize, updatetime }) {
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
    if (updatetime && orderWhiteList.includes(updatetime)) {
      order.updatetime = updatetime;
    }

    const field = 'id,title,imgurl,hits,word_count,updatetime,is_show,pathname';
    const list = await this.where(where)
      .field(field)
      .order(order)
      .page(page, pageSize)
      .countSelect();

    return list;
  }

  /**
   * 解析并确保 pathname 唯一
   * @param {Object} data 文章数据（含 title, pathname）
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
          fallbackPrefix: 'article',
          fallbackId: excludeId,
          excludeId
        });
      }
      return slugify.ensureUniqueSlug(this, base, excludeId);
    }
    return slugify.generateSlug({
      model: this,
      title: data.title,
      fallbackPrefix: 'article',
      fallbackId: excludeId,
      excludeId
    });
  }

  /**
   * 新增文章
   * @param {Object} data 文章信息
   * @param {String} siteurl 网站地址
   */
  async createPost(data, siteurl) {
    const { imgurl, content } = data;
    if (imgurl) data.imgurl = this.getRelativeImgUrl(imgurl, siteurl);
    if (content) data.content = this.getRelativeContentUrl(content, siteurl);
    data.pathname = await this.resolvePathname(data);
    const insertId = await this.add(data);
    // 若新增时 title 为空导致 fallback 用了空 prefix，需在拿到 id 后回填
    if (!data.pathname || data.pathname === 'article') {
      const finalSlug = await slugify.generateSlug({
        model: this,
        title: data.title,
        fallbackPrefix: 'article',
        fallbackId: insertId,
        excludeId: insertId
      });
      await this.where({ id: insertId }).update({ pathname: finalSlug });
    }
    return insertId;
  }

  /**
   * 更新文章
   * @param {Object} data 文章信息
   * @param {String} siteurl 网站地址
   */
  async updatePost(id, data, siteurl) {
    const { imgurl, content } = data;
    if (imgurl) data.imgurl = this.getRelativeImgUrl(imgurl, siteurl);
    if (content) data.content = this.getRelativeContentUrl(content, siteurl);
    // 只有当 pathname 字段被显式提交时才处理
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
