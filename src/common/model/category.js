module.exports = class extends think.Model {
  /**
   * get column
   * @return {Array} 栏目数组
   */
  async getCategory() {
    // 设置缓存 key 为 column，有效期为 30 天
    const field = 'id,name,keywords,description,folder_name,filename,parent_id,type,level,no_order,is_nav,mark_name,icon,is_show'
    const list = await this.cache('category', { timeout: 30 * 24 * 3600 * 1000 })
      .where({ is_show: 1 })
      .field(field)
      .order('no_order ASC')
      .select()
    return list
  }

  async getChildrenCategory(categorys, id) {
    const flattenCategory = this.flattenDeep(categorys, [id])
    const findCategory = Array.from(new Set(flattenCategory))
    return findCategory
  }

  flattenDeep(data, predicate, target = []) {
    const findCategory = data.filter(item => predicate.includes(item.id)).map(item => item.id)
    const childrenCategory = data.filter(item => predicate.includes(item.parent_id)).map(item => item.id)
    target = [...target, ...findCategory, ...childrenCategory]

    if (childrenCategory.length) {
      return this.flattenDeep(data, childrenCategory, target)
    } else {
      return target
    }
  }
}
