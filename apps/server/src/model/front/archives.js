module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Array}
   */
  async selectPost(childCategories) {
    const field = 'id,title,updatetime,category_id';
    const where = { is_show: 1, is_recycle: 0 };
    // 查询所有子栏目的记录
    if (childCategories.length) {
      where.category_id = ['IN', childCategories];
    }

    const list = await this.model('article').where(where)
      .field(field)
      .order('updatetime DESC')
      .select();

    return list;
  }
};
