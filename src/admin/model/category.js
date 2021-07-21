module.exports = class extends think.Model {
  constructor(...args) {
    super(...args);
    this.modelMap = ['', '', 'blog', 'image', 'bangumi', 'webapp', 'video'];
  }

  /**
   * get category
   * @return {Array} 栏目数组
   */
  async getCategory() {
    const field = 'id,name,parent_id,level,type,no_order,is_nav';
    const list = await this.where({ is_show: 1 })
      .field(field)
      .order('no_order ASC')
      .select();
    return list;
  }

  /**
   * 删除栏目
   * @param {Number} id 栏目id
   */
  async deleteColumn(id) {
    const row = await this.where({ id }).find();
    const _model = this.modelMap[row.type];
    const content = await this.model(_model).where(`category_id = ${id}`).select();
    const data = content.map(item => {
      return {
        id: item.id,
        is_recycle: 1
      };
    });
    await this.model(_model).updateMany(data);
    let result = {};
    if (row.level === 1) {
      const pidArr = await this.where({ parent_id: id }).getField('id');
      let query = `id = ${id} OR parentid = ${id}`;
      pidArr.forEach(element => {
        query += ` OR parentid = ${element}`;
      });
      result = await this.where(query).delete();
    } else {
      result = await this.where({ id: id, parent_id: id, _logic: 'OR' }).delete();
    }
    return result;
  }
};
