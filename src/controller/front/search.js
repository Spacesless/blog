const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const { type, keyword, page = 1 } = this.get();

    const configs = await this.getConfigs();
    const categorys = await this.getCategory();

    let list;
    const pageSize = 20;
    if (keyword) {
      const allData = await this.model('front/search').selectPost(type, keyword);

      const count = allData.length;

      const data = allData.slice((page - 1) * pageSize, page * pageSize);
      for (const element of data) {
        const { id, title, category_id: categoryId, type, imgurl } = element;
        let content = element.content;
        const findCategory = categorys.find(item => item.id === categoryId);

        const targetTitle = title.indexOf(keyword) > -1 ? title.replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`) : title;
        content = content.replace(/<.*?>/g, '');
        const keyIndex = content.indexOf(keyword);
        const start = keyIndex - 60;
        const targetContent = keyIndex > -1
          ? content.substr(start < 0 ? 0 : start, 130).replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`)
          : content.substr(0, 130);

        let width;
        let height;
        if (type === 'bangumi') {
          width = configs.bangumi_width;
          height = configs.bangumi_height;
        } else {
          width = configs.article_width;
          height = configs.article_height;
        }

        const classList = categorys.filter(item => item.id === categoryId).map(item => {
          return {
            name: item.name,
            url: `/${item.type}/${item.id}`
          };
        });

        Object.assign(element, {
          title: targetTitle,
          content: targetContent,
          url: `/${findCategory.type}/detail/${id}`,
          imgurl: await this.getThumbnail(imgurl, width, height, configs.image_fit),
          classList
        });
      }

      list = {
        pageSize,
        currentPage: +page,
        count,
        totalPages: Math.ceil(allData.length / pageSize),
        data
      };
    } else {
      list = [];
    }

    return this.success(list);
  }
};
