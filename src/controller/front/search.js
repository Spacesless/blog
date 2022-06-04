const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const { classify, keyword, page = 1 } = this.get();

    let list;
    const pageSize = 10;
    if (keyword) {
      const allData = await this.model('front/search').selectPost(classify, keyword);

      // 转换列表
      const data = allData.slice((page - 1) * pageSize, page * pageSize);
      for (const element of data) {
        const { type } = element;

        // 内容添加关键字标识
        let content = element.content;
        content = content.replace(/<.*?>/g, '');
        const keyIndex = content.search(new RegExp(keyword, 'i'));
        const start = keyIndex - 60;
        const targetContent = content.substr(start < 0 ? 0 : start, 120);

        Object.assign(element, {
          type,
          content: targetContent
        });
      }

      const count = allData.length;
      list = {
        pageSize,
        count,
        data,
        currentPage: +page,
        totalPages: Math.ceil(count / pageSize)
      };
    } else {
      list = {
        count: 0
      };
    }

    return this.success(list);
  }
};
