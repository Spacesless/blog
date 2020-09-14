const Base = require('./base.js')

module.exports = class extends Base {
  async __before() {
    await super.__before()
    this.baseUrl = 'https:' + this.siteurl
    this.archives = await this.getArchives()
  }

  // rss订阅
  async rssAction() {
    this.assign('siteurl', this.baseUrl)

    const configs = await this.model('config').getConfig()
    this.assign('options', configs)

    this.assign('currentTime', (new Date()).toUTCString())

    const list = await this.getRssList()
    this.assign('list', list)

    this.ctx.type = 'text/xml'
    return super.display('home/rss.xml')
  }

  // sitemap地图
  async sitemapAction() {
    this.assign('siteurl', this.baseUrl)

    const categorys = await this.getCategory()
    const list = await this.getSitemapList(categorys)
    this.assign('list', list)

    const lastmod = list.length ? list[0].updatetime : think.datetime(new Date(), 'YYYY-MM-DD')
    this.assign('lastmod', lastmod)

    const _columns = JSON.parse(JSON.stringify(categorys))
    const category = _columns.map(item => {
      const { id, url, level } = item
      let rows = list.filter(element => element.category_id === id)
      let lastmod
      if (rows.length) {
        rows = rows.sort((a, b) => {
          return new Date(b.updatetime) - new Date(a.updatetime)
        })
        lastmod = rows[0].updatetime
      }
      return {
        url: `${this.baseUrl}${url}`,
        lastmod: lastmod || think.datetime(new Date(), 'YYYY-MM-DD'),
        priority: level === 1 ? 0.9 : (level === 2 ? 0.8 : 0.7)
      }
    })
    this.assign('category', category)

    this.ctx.type = 'text/xml'
    return super.display('home/sitemap.xml')
  }

  /**
   * 所有文章归档
   * @returns {Array} 文章列表
   */
  async getArchives() {
    const field = 'id,title,description,updatetime,category_id'
    const where = 'where is_show = 1'
    const SQL = `
      SELECT ${field} FROM tl_article ${where} UNION ALL
      SELECT ${field} FROM tl_bangumi ${where}
    `
    const rows = await this.model('config').query(SQL)
    return rows
  }

  /**
   * 获取最新6条动态
   * @returns {Array} 文章列表 {...url}
   */
  async getRssList() {
    const categorys = await this.getCategory()

    const archives = JSON.parse(JSON.stringify(this.archives))
    const Rss = archives.sort((a, b) => {
      return new Date(b.updatetime) - new Date(a.updatetime)
    }).slice(0, 6)
    Rss.forEach(item => {
      const { id, category_id } = item
      const findCategory = categorys.find(element => element.id === category_id)
      item.url = findCategory ? `${this.baseUrl}/${findCategory.folder_name}/detail/${id}` : ''
    })
    return Rss
  }

  /**
   * 获取sitemap列表
   * @returns {Array} 文章列表 {...url,...priority}
   */
  async getSitemapList(categorys) {
    const archives = JSON.parse(JSON.stringify(this.archives))
    const Sitemap = archives.sort((a, b) => {
      return new Date(b.updatetime) - new Date(a.updatetime)
    })
    Sitemap.forEach(item => {
      const { id, category_id } = item
      const findCategory = categorys.find(element => element.id === category_id)
      item.url = findCategory ? `${this.baseUrl}/${findCategory.folder_name}/detail/${id}` : ''
      item.priority = 0.6
    })
    return Sitemap
  }
}
