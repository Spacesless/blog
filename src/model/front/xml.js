module.exports = class extends think.Model {
  /**
   * 所有文章归档
   * @returns {Array} 文章列表
   */
  async selectArchives() {
    const field = 'id,title,description,updatetime,category_id';
    const where = 'where is_show = 1';
    const SQL = `
      SELECT ${field} FROM tl_article ${where} UNION ALL
      SELECT ${field} FROM tl_bangumi ${where}
    `;
    const rows = await this.model('article').query(SQL);
    return rows;
  }
};
