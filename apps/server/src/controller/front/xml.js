const Base = require('./base.js');

module.exports = class extends Base {
  async __before() {
    this.baseurl = this.siteurl;
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
      const { id, level } = item;
      const rows = sitemapList.filter(element => element.category_id === id);
      let lastmod;
      if (rows.length) {
        rows.sort((a, b) => new Date(b.updatetime) - new Date(a.updatetime));
        lastmod = rows[0].updatetime;
      }
      return {
        url: `${this.baseurl}${this.getCategoryPath(item)}`,
        lastmod: lastmod || think.datetime(new Date(), 'YYYY-MM-DD'),
        priority: level === 1 ? 0.9 : (level === 2 ? 0.8 : 0.7)
      };
    });
    this.assign('categoryList', targetCategory);

    this.ctx.type = 'text/xml';
    return super.display('home/sitemap.xml');
  }

  /**
   * 获取栏目在 sitemap 中的路径
   * 没有 pathname(filename) 的栏目回退到栏目类型首页，避免输出 /article/1、/tool/3 这类地址
   * @param {Object} category 栏目数据
   * @returns {string} 以 / 开头的栏目路径
   */
  getCategoryPath(category) {
    const { type, filename } = category;
    // 单页栏目：/about、/link
    if (type === 'page') {
      return `/${filename || type}`;
    }
    // 工具栏目只有一个 /tool 页面，没有按分类拆分的列表页
    if (type === 'tool') {
      return `/${type}`;
    }
    // 列表栏目：有 pathname 用 /article/work，没有 pathname 回退到 /article
    return filename ? `/${type}/${filename}` : `/${type}`;
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
      const { id, category_id: categoryId, pathname } = item;
      const findCategory = categories.find(element => element.id === categoryId);
      const slug = pathname || id;
      item.url = findCategory ? `${this.baseurl}/${findCategory.type}/detail/${slug}` : '';
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
      const { id, category_id: categoryId, pathname } = item;
      const findCategory = categories.find(element => element.id === categoryId);
      const slug = pathname || id;
      item.url = findCategory ? `${this.baseurl}/${findCategory.type}/detail/${slug}` : '';
      item.priority = 0.6;
    });
    return sitemapList;
  }
};
