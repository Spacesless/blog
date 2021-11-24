module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Object}
   */
  async selectPost({ category, page, pageSize, sortBy, orderBy, status, progress, tags, childCategories }) {
    const field = 'id,title,description,total,current,ratings,imgurl,showtime,status,tag';
    const sort = sortBy || 'updatetime';
    const order = orderBy ? orderBy.toUpperCase() : 'DESC';

    const where = { is_show: 1, is_recycle: 0 };
    if (childCategories.length) {
      where.category_id = ['IN', childCategories];
    }
    // 番剧状态
    if (status) {
      where.status = status;
    }
    // 追剧进度
    switch (progress) {
      case '0':
        where.current = ['EXP', '< `total`'];
        break;
      case '1':
        where.current = ['EXP', '= `total`'];
        break;
    }
    // tag标签
    if (tags) {
      where.tag = ['like', tags.split(',').map(item => `%${item}%`)];
    }

    const list = await this.where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect();

    return list;
  }
};
