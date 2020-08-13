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
    this.assign('options', this.options)
    this.assign('currentTime', (new Date()).toUTCString())

    const list = await this.getRssList()
    this.assign('list', list)

    this.ctx.type = 'text/xml'
    return super.display('home/rss.xml')
  }

  // sitemap地图
  async sitemapAction() {
    this.assign('siteurl', this.baseUrl)

    const list = await this.getSitemapList()
    this.assign('list', list)

    const lastmod = list.length ? list[0].updatetime : think.datetime(new Date(), 'YYYY-MM-DD')
    this.assign('lastmod', lastmod)

    const _columns = JSON.parse(JSON.stringify(this.columns))
    const columns = _columns.map(item => {
      const { id, url, classtype } = item
      const classMap = ['', 'class1', 'class2', 'class3']
      let rows = list.filter(element => element[classMap[classtype]] === id)
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
        priority: classtype === 1 ? 0.9 : (classtype === 2 ? 0.8 : 0.7)
      }
    })
    this.assign('columns', columns)

    this.ctx.type = 'text/xml'
    return super.display('home/sitemap.xml')
  }

  /**
   * 所有文章归档
   * @returns {Array} 文章列表
   */
  async getArchives() {
    const field = 'id,title,description,updatetime,class1,class2,class3'
    const where = 'where is_show = 1'
    const SQL = `
      SELECT ${field} FROM tl_blog ${where} UNION ALL
      SELECT ${field} FROM tl_image ${where} UNION ALL
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
    const archives = JSON.parse(JSON.stringify(this.archives))
    const Rss = archives.sort((a, b) => {
      return new Date(b.updatetime) - new Date(a.updatetime)
    }).slice(0, 6)
    Rss.forEach(item => {
      const { id, class1, class2, class3 } = item
      const _class = class1 || (class2 || class3)
      const row = this.columns.find(element => element.id === _class)
      item.url = row ? `${this.baseUrl}/${row.folderName}/content/${id}` : ''
    })
    return Rss
  }

  /**
   * 获取sitemap列表
   * @returns {Array} 文章列表 {...url,...priority}
   */
  async getSitemapList() {
    const archives = JSON.parse(JSON.stringify(this.archives))
    const Sitemap = archives.sort((a, b) => {
      return new Date(b.updatetime) - new Date(a.updatetime)
    })
    Sitemap.forEach(item => {
      const { id, class1, class2, class3 } = item
      const _class = class1 || (class2 || class3)
      const row = this.columns.find(element => element.id === _class)
      item.url = row ? `${this.baseUrl}/${row.folderName}/content/${id}` : ''
      item.priority = 0.6
    })
    return Sitemap
  }
}
