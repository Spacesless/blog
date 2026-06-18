module.exports = class extends think.Model {
  /**
   * 查询列表
   * @param {Object} params 查询条件
   * @returns {Object}
   */
  async selectPost({ page, pageSize, childCategories }) {
    const field =
      "id,title,description,total,current,ratings,imgurl,updatetime,status,tag,pathname";

    const where = { is_show: 1, is_recycle: 0 };
    if (childCategories.length) {
      where.category_id = ["IN", childCategories];
    }

    const list = await this.where(where)
      .field(field)
      .order("updatetime DESC")
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
      id: ["!=", id],
      category_id: categoryId,
      is_recycle: 0,
      is_show: 1,
      tag: ["like", tags.split("|").map((item) => `%${item}%`)],
    };
    const listCount = await this.where(where).count();

    if (listCount < 4) {
      delete where.tag;
    }

    const list = await this.field("id,title,description")
      .limit(0, 8)
      .where(where)
      .order("updateTime DESC")
      .select();

    return list;
  }
};
