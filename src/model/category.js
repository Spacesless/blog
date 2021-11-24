module.exports = class extends think.Model {
  /**
   * get category
   * @return {Array} 栏目数组
   */
  async getCacheCategory() {
    // 设置缓存 key 为 column，有效期为 30 天
    const field = 'id,name,keywords,description,filename,parent_id,type,level,is_nav,icon,version,link';
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
   * @param {Array} categories
   */
  formatCategoryUrl(categories) {
    categories.forEach(item => {
      const { id, filename, type, level, link } = item;
      if (link) return;

      switch (type) {
        case 'page':
          item.url = `/${filename || type}`;
          break;
        case 'tool':
          item.url = level === 1 ? `/${type}/${id}` : `/${type}/${filename}`;
          break;
        default:
          item.url = `/${type}/${id}`;
      }
    });
    return categories;
  }

  /**
   * 获取指定栏目以及它所有子栏目id
   * @param {Array} categories 栏目数组
   * @param {Number [int]} id 指定栏目id
   * @returns {Array} 指定栏目id以及它所有子栏目id的数组
   */
  async findChildCategory(categories, id) {
    if (!id) return [];
    const flattenCategory = this.flattenDeep(categories, [id]);
    const findCategory = Array.from(new Set(flattenCategory));
    return findCategory;
  }

  /**
   * 递归查找符合条件的栏目以及它的子栏目
   * @param {Array} categories 栏目数组
   * @param {Array} predicate 查找条件
   * @param {Array} target 目标数组
   */
  flattenDeep(categories, predicate, target = []) {
    const findCategory = categories.filter(item => predicate.includes(item.id));
    const childrenCategory = categories.filter(item => predicate.includes(item.parent_id));
    target = [...target, ...findCategory, ...childrenCategory];

    if (childrenCategory.length) {
      return this.flattenDeep(categories, childrenCategory, target);
    } else {
      return target.map(item => item.id);
    }
  }
};
