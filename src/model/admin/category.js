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
    const row = await this.where({ id }).find();
    const type = row.type;
    const content = await this.model(type).where(`category_id = ${id}`).select();
    const data = content.map(item => {
      return {
        id: item.id,
        is_recycle: 1
      };
    });
    await this.model(type).updateMany(data);
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
