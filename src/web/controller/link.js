const Base = require('./base.js')

module.exports = class extends Base {
  async indexAction() {
    const links = await this.model('link')
      .where({ is_show: 1 })
      .select()

    return this.success(links)
  }
}
