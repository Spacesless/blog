module.exports = class extends think.Model {
  /**
   * get category
   * @return {Array} 栏目数组
   */
  async getCategory() {
    const field = 'id,name,parent_id,level,type,no_order,is_nav,is_show';
    const list = await this.field(field)
      .order('no_order ASC')
      .select();
    return list;
  }

  /**
   * 删除栏目
   * @param {Number} id 栏目id
   */
  async deleteColumn(id) {
    const categories = await this.getCategory();
    const findCategory = this.model('category').findChildCategory(categories, id);

    const promises = [];
    findCategory.forEach(id => {
      const step = this.where({ id }).delete();
      promises.push(step);
    });

    return Promise.allSettled(promises);
  }
};
