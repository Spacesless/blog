module.exports = class extends think.Model {
  /**
   * get category
   * @return {Array} 栏目数组
   */
  async getCacheCategory() {
    // 设置缓存 key 为 column，有效期为 30 天
    const field = 'id,name,keywords,description,filename,parent_id,type,level,no_order,is_nav,mark_name,icon,version,link,is_show';
    const list = await this.cache('category', { timeout: 90 * 24 * 3600 * 1000 })
      .where({ is_show: 1 })
      .field(field)
      .order('no_order ASC')
      .select();

    this.formatCategoryUrl(list);

    return list;
  }

  /**
   * 格式化导航菜单地址
   * @param {Array} categorys
   */
  formatCategoryUrl(categorys) {
    categorys.forEach(item => {
      const { id, filename, type } = item;
      let path;
      if (think.isEmpty(filename)) {
        switch (type) {
          case 'about':
          case 'link':
          case 'tool':
            path = '';
            break;
          default:
            path = id;
        }
      } else {
        path = `${filename}`;
      }
      item.url = `/${type}/${path}`;
    });
    return categorys;
  }

  /**
   * 获取指定栏目以及它所有子栏目id
   * @param {Array} categorys 栏目数组
   * @param {Number [int]} id 指定栏目id
   * @returns {Array} 指定栏目id以及它所有子栏目id的数组
   */
  async findChildCategory(categorys, id) {
    const flattenCategory = this.flattenDeep(categorys, [id]);
    const findCategory = Array.from(new Set(flattenCategory));
    return findCategory;
  }

  /**
   * 递归查找符合条件的栏目一级它的子栏目
   * @param {Array} categorys 栏目数组
   * @param {Array} predicate 查找条件
   * @param {Array} target 目标数组
   */
  flattenDeep(categorys, predicate, target = []) {
    const findCategory = categorys.filter(item => predicate.includes(item.id));
    const childrenCategory = categorys.filter(item => predicate.includes(item.parent_id));
    target = [...target, ...findCategory, ...childrenCategory];

    if (childrenCategory.length) {
      return this.flattenDeep(categorys, childrenCategory, target);
    } else {
      return target.map(item => item.id);
    }
  }
};