module.exports = class extends think.Model {
  selectBanner() {
    const bannerField = 'id,imgurl,title';
    return this.model('banner')
      .cache('banner', { timeout: 90 * 24 * 3600 * 1000 })
      .field(bannerField)
      .where({ is_show: 1 })
      .order('sort ASC')
      .select();
  }

  /**
   * 查询文章
   * @param {Number} limit 查询数量
   */
  selectArticle(limit = 8) {
    const articleField = 'id,title,description,imgurl,category_id,hits,updatetime,tag';
    const articleWhere = { is_show: 1, is_recycle: 0 };
    return this.model('article')
      .cache('article', { timeout: 3 * 24 * 3600 * 1000 })
      .field(articleField)
      .where(articleWhere)
      .limit(limit)
      .order('updatetime DESC')
      .select();
  }

  /**
   * 查询番剧
   * @param {Number} limit 查询数量
   */
  selectBangumi(limit = 6) {
    const bangumiField = 'id,title,description,category_id,imgurl,total,current,showtime,status,ratings,tag';
    const bangumiWhere = { is_show: 1, is_recycle: 0, status: ['!=', 0], current: ['EXP', '< `total`'] };
    return this.model('bangumi')
      .cache('bangumi', { timeout: 3 * 24 * 3600 * 1000 })
      .field(bangumiField)
      .where(bangumiWhere)
      .limit(limit)
      .order('updatetime DESC')
      .select();
  }
};
