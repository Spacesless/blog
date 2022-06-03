const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const { type, keyword, page = 1 } = this.get();

    let list;
    const pageSize = 20;
    if (keyword) {
      const allData = await this.model('front/search').selectPost(type, keyword);

      // 转换列表
      const data = allData.slice((page - 1) * pageSize, page * pageSize);
      for (const element of data) {
        const { title, type } = element;

        // 标题添加关键字标识
        const targetTitle = title.indexOf(keyword) > -1 ? title.replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`) : title;

        // 内容添加关键字标识
        let content = element.content;
        content = content.replace(/<.*?>/g, '');
        const keyIndex = content.indexOf(keyword);
        const start = keyIndex - 60;
        const targetContent = keyIndex > -1
          ? content.substr(start < 0 ? 0 : start, 130).replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`)
          : content.substr(0, 130);

        Object.assign(element, {
          type,
          title: targetTitle,
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
      list = {};
    }

    return this.success(list);
  }
};
