module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Object}
   */
  async selectPost({ category, page, pageSize, sortBy, orderBy, tags }, categorys) {
    const field = 'id,title,description,imgurl,updatetime,hits,tag';
    const sort = sortBy || 'updatetime';
    const order = orderBy ? orderBy.toUpperCase() : 'DESC';

    const where = { is_show: 1, is_recycle: 0 };
    const childCategories = await this.model('category').findChildCategory(categorys, category.id);
    where.category_id = ['IN', childCategories];
    // tag标签
    if (tags) where.tag = ['like', tags.split(',').map(item => `%${item}%`)];

    const list = await this.where(where)
      .field(field)
      .order(`${sort} ${order}`)
      .page(page, pageSize)
      .countSelect();

    return list;
  }
};
