module.exports = class extends think.Model {
  async selectBanner() {
    const bannerField = 'id,imgurl,title';
    await this.model('banner')
      .field(bannerField)
      .where({ is_show: 1 })
      .order('sort ASC')
      .select();
  }

  /**
   * 查询文章
   * @param {Number} limit 查询数量
   */
  async selectArticle(limit = 8) {
    const articleField = 'id,imgurl,title,description,category_id,hits,updatetime';
    const articleWhere = { is_show: 1, is_recycle: 0 };
    await this.model('article')
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
  async selectBangumi(limit = 6) {
    const bangumiField = 'id,title,description,total,current,imgurl,showtime,status';
    const bangumiWhere = { is_show: 1, is_recycle: 0, status: ['!=', 0], current: ['EXP', '< `total`'] };
    await this.model('bangumi')
      .field(bangumiField)
      .where(bangumiWhere)
      .limit(limit)
      .order('updatetime DESC')
      .select();
  }
};
