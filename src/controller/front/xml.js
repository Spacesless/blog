const Base = require('./base.js');

module.exports = class extends Base {
  async __before() {
    this.baseurl = 'https:' + this.siteurl;
    this.archives = await this.model('front/xml').selectArchives();
  }

  // rss订阅
  async rssAction() {
    this.assign('siteurl', this.baseurl);

    const configs = await this.model('config').getCacheConfig();
    this.assign('options', configs);

    this.assign('currentTime', (new Date()).toUTCString());

    const list = await this.getRssList();
    this.assign('list', list);

    this.ctx.type = 'text/xml';
    return super.display('home/rss.xml');
  }

  // sitemap地图
  async sitemapAction() {
    this.assign('siteurl', this.baseurl);

    const categories = await this.model('category').getCacheCategory();
    const sitemapList = await this.getSitemapList(categories);
    this.assign('list', sitemapList);

    const lastmod = sitemapList.length ? sitemapList[0].updatetime : think.datetime(new Date(), 'YYYY-MM-DD');
    this.assign('lastmod', lastmod);

    const filterCategory = categories.filter(item => !item.link);
    const targetCategory = filterCategory.map(item => {
      const { id, url, level } = item;
      const rows = sitemapList.filter(element => element.category_id === id);
      let lastmod;
      if (rows.length) {
        rows.sort((a, b) => new Date(b.updatetime) - new Date(a.updatetime));
        lastmod = rows[0].updatetime;
      }
      return {
        url: `${this.baseurl}${url}`,
        lastmod: lastmod || think.datetime(new Date(), 'YYYY-MM-DD'),
        priority: level === 1 ? 0.9 : (level === 2 ? 0.8 : 0.7)
      };
    });
    this.assign('categoryList', targetCategory);

    this.ctx.type = 'text/xml';
    return super.display('home/sitemap.xml');
  }

  /**
   * 获取最新6条动态
   * @returns {Array} 文章列表 {...url}
   */
  async getRssList() {
    const categories = await this.model('category').getCacheCategory();

    const archives = JSON.parse(JSON.stringify(this.archives));
    const rssList = archives.sort((a, b) => {
      return new Date(b.updatetime) - new Date(a.updatetime);
    }).slice(0, 6);
    rssList.forEach(item => {
      const { id, category_id: categoryId } = item;
      const findCategory = categories.find(element => element.id === categoryId);
      item.url = findCategory ? `${this.baseurl}/${findCategory.type}/detail/${id}` : '';
    });
    return rssList;
  }

  /**
   * 获取sitemap列表
   * @returns {Array} 文章列表 {...url,...priority}
   */
  async getSitemapList(categories) {
    const archives = JSON.parse(JSON.stringify(this.archives));
    const sitemapList = archives.sort((a, b) => {
      return new Date(b.updatetime) - new Date(a.updatetime);
    });
    sitemapList.forEach(item => {
      const { id, category_id: categoryId } = item;
      const findCategory = categories.find(element => element.id === categoryId);
      item.url = findCategory ? `${this.baseurl}/${findCategory.type}/detail/${id}` : '';
      item.priority = 0.6;
    });
    return sitemapList;
  }
};
