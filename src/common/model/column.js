module.exports = class extends think.Model {
  constructor(...args) {
    super(...args);
    this.modelMap = ['', 'blog', 'image', 'video', 'webapp', 'bangumi'];
    this.classMap = ['', 'gid', 'pid', 'cid'];
  }
  /**
   * 删除栏目
   * @param {Number} id 栏目id
   */
  async deleteColumn(id) {
    const row = await this.where({ id }).find();
    const _model = this.modelMap[row.module];
    const classtype = this.classMap[row.classtype];
    const content = await this.model(_model).where(`${classtype} = ${id}`).select();
    var column = {};
    if (row.classtype === 1) {
      const pidArr = await this.where({parentid: id}).getField('id');
      var query = `id = ${id} OR parentid = ${id}`;
      pidArr.forEach(element => {
        query += ` OR parentid = ${element}`;
      });
      column = await this.where(query).select();
    } else {
      column = await this.where({id: id, parentid: id, _logic: 'OR'}).select();
    }
    return { column, content };
  }
  /**
   * get column
   * @return {Array} 栏目数组
   */
  async getColumn() {
    const field = 'id,name,folder_name,parent_id AS parentid,classtype,module,no_order,list_order,is_nav';
    // 设置缓存 key 为 column，有效期为 7 天
    const list = await this.cache('column', { timeout: 7 * 24 * 3600 * 1000 })
      .field(field)
      .order('no_order ASC')
      .select();
    return list;
  }
};
