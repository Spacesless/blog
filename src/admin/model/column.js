module.exports = class extends think.Model {
  constructor(...args) {
    super(...args)
    this.modelMap = ['', '', 'blog', 'image', 'bangumi', 'webapp', 'video']
    this.classMap = ['', 'class1', 'class2', 'class3']
  }
  /**
   * 删除栏目
   * @param {Number} id 栏目id
   */
  async deleteColumn(id) {
    const row = await this.where({ id }).find()
    const _model = this.modelMap[row.type]
    const classtype = this.classMap[row.classtype]
    const content = await this.model(_model).where(`${classtype} = ${id}`).select()
    const data = content.map(item => {
      return {
        id: item.id,
        is_recycle: 1
      }
    })
    await this.model(_model).updateMany(data)
    let result = {}
    if (row.classtype === 1) {
      const pidArr = await this.where({ parentid: id }).getField('id')
      let query = `id = ${id} OR parentid = ${id}`
      pidArr.forEach(element => {
        query += ` OR parentid = ${element}`
      })
      result = await this.where(query).delete()
    } else {
      result = await this.where({ id: id, parentid: id, _logic: 'OR' }).delete()
    }
    return result
  }
}
