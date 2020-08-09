const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const pathname = this.get('pathname');
    const rows = this.columns.find(item => item.id === +pathname);

    if (!rows) {
      return this.ctx.throw(404);
    }

    const { name: title, keywords, description, content } = rows;
    const seo = {
      title: title + this.title,
      keywords,
      description
    };

    const data = {
      seo,
      content
    };

    return this.success(data);
  }
};
