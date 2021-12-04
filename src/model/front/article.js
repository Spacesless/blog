module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Object}
   */
  async selectPost({ category, page, pageSize, sortBy, orderBy, tags, childCategories }) {
    const field = 'id,title,description,imgurl,updatetime,hits,tag,word_count';
    const sort = sortBy || 'updatetime';
    const order = orderBy ? orderBy.toUpperCase() : 'DESC';

    const where = { is_show: 1, is_recycle: 0 };
    // 查询所有子栏目的记录
    if (childCategories.length) {
      where.category_id = ['IN', childCategories];
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
