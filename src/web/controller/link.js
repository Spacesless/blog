const Base = require('./base.js')

module.exports = class extends Base {
  async indexAction() {
    const links = await this.model('link')
      .where({ is_show: 1 })
      .order('no_order ASC')
      .select()

    return this.success(links)
  }
}
