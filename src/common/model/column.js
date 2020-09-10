module.exports = class extends think.Model {
  /**
   * get column
   * @return {Array} 栏目数组
   */
  async getColumn() {
    // 设置缓存 key 为 column，有效期为 7 天
    const field = 'id,name,keywords,description,folder_name AS folderName,filename,parent_id AS parentid,classtype,type,no_order,is_nav,mark_name AS markName,icon,is_show'
    const list = await this.cache('column', { timeout: 30 * 24 * 3600 * 1000 })
      .where({ is_show: 1 })
      .field(field)
      .order('no_order ASC')
      .select()
    return list
  }
}
