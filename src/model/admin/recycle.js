module.exports = class extends think.Model {
  async selectPost(type) {
    const field = 'id,title,category_id,updatetime';
    const articleList = type && type !== 'article' ? [] : await this.model('article')
      .field(`${field},'article' as type`)
      .where({ is_recycle: 1 })
      .select();
    const bangumiList = type && type !== 'bangumi' ? [] : await this.model('bangumi')
      .field(`${field},'bangumi' as type`)
      .where({ is_recycle: 1 })
      .select();
    const totalList = [...articleList, ...bangumiList];

    return totalList;
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
