const sortEnum = {
  updatetime: 'updatetime',
  addtime: 'addtime',
  ratings: 'ratings'
};

const orderEnum = {
  asc: 'ASC',
  desc: 'DESC'
};

module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Object}
   */
  async selectPost({ category, page, pageSize, sortBy, orderBy, status, progress, tags, childCategories }) {
    const field = 'id,title,description,total,current,ratings,imgurl,showtime,status,tag';
    const sort = sortEnum[sortBy] || 'updatetime';
    const order = orderEnum[orderBy] || 'DESC';

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
      .limit(0, 6)
      .where(where)
      .order('updateTime DESC')
      .select();

    return list;
  }
};
