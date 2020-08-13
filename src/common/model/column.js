module.exports = class extends think.Model {
  constructor(...args) {
    super(...args)
    this.modelMap = ['', 'blog', 'image', 'video', 'webapp', 'bangumi']
    this.classMap = ['', 'gid', 'pid', 'cid']
  }
  /**
   * get column
   * @return {Array} 栏目数组
   */
  async getColumn() {
    const field = 'id,name,folder_name,parent_id AS parentid,classtype,module,no_order,list_order,is_nav'
    // 设置缓存 key 为 column，有效期为 7 天
    const list = await this.cache('column', { timeout: 7 * 24 * 3600 * 1000 })
      .field(field)
      .order('no_order ASC')
      .select()
    return list
  }
}
