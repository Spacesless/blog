module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Array}
   */
  async selectPost({ page, pageSize, childCategories, tags }) {
    const field = 'id,title,description,imgurl,updatetime,hits,tag,word_count,pathname';

    const where = { is_show: 1, is_recycle: 0 };
    // 查询所有子栏目的记录
    if (childCategories.length) {
      where.category_id = ['IN', childCategories];
    }
    // 标签筛选
    if (tags) {
      where.tag = ['like', tags.split('|').map(item => `%${item}%`)];
    }

    const list = await this.where(where)
      .field(field)
      .order('updatetime DESC')
      .page(page, pageSize)
      .countSelect();

    return list;
  }

  /**
   * 查询推荐列表
   * @param {Object} params 查询条件
   * @returns {Array}
   */
  async samePost({ id, categoryId, tags }) {
    const where = {
      id: ['!=', id],
      category_id: categoryId,
      is_recycle: 0,
      is_show: 1,
      tag: ['like', tags.split('|').map(item => `%${item}%`)]
    };
    const listCount = await this.where(where)
      .count();

    if (listCount < 4) {
      delete where.tag;
    }

    const list = await this.field('id,title,description')
      .limit(0, 8)
      .where(where)
      .order('updateTime DESC')
      .select();

    return list;
  }
};
