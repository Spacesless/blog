module.exports = class extends think.Model {
  async selectPost({type, page, pageSize}) {
    const field = 'id,title,category_id,updatetime';

    const list = await this.model(type)
      .field(`${field},'${type}' as type`)
      .where({ is_recycle: 1 })
      .order('updatetime DESC')
      .page(page, pageSize)
      .countSelect();

    return list;
  }

  /**
   * 还原回收站
   * @param {Array} list
   * @returns {Array}
   */
  async restorePost(list) {
    const promiseList = [];
    list.forEach(item => {
      const { id, type } = item;
      const step = this.model(type).where({ id }).update({
        updatetime: new Date(),
        is_recycle: 0
      });
      promiseList.push(step);
    });

    let affectedRows;
    await Promise.all(promiseList).then(result => {
      affectedRows = [...result];
    });

    return affectedRows;
  }
};
