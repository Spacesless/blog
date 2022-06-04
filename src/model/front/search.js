module.exports = class extends think.Model {
  /**
   * 搜索列表
   * @param {String} type 模型
   * @param {String} keyword 关键字
   * @returns {Array}
   */
  async selectPost(type, keyword) {
    const typpeEnum = {
      article: 'article',
      bangumi: 'bangumi'
    };
    const field = 'id,title,content,category_id,updatetime';
    let SQL;
    let where = 'WHERE ( `is_show` = 1 ) AND ( `is_recycle` = 0 )';
    const modelName = typpeEnum[type];
    where += `AND ( ( title LIKE '%${keyword}%') OR ( content LIKE '%${keyword}%') )`;
    if (!think.isEmpty(modelName)) {
      SQL = `
        SELECT ${field},'${modelName}' as type FROM tl_${modelName} ${where}
      `;
    } else {
      SQL = `
        SELECT ${field},'article' as type FROM tl_article ${where} UNION ALL
        SELECT ${field},'bangumi' as type FROM tl_bangumi ${where}
      `;
    }

    const allData = await this.model('article').query(SQL);

    allData.sort((a, b) => new Date(b.updatetime) - new Date(a.updatetime));

    return allData;
  }
};
