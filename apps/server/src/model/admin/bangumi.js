const Base = require('./base.js');

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

    const field = 'id,title,imgurl,total,current,status,ratings,is_show';
    const list = await this.where(where)
      .field(field)
      .order(order)
      .page(page, pageSize)
      .countSelect();

    return list;
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
    const insertId = await this.add(data);
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
