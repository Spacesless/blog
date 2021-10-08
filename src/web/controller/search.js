const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const { type, keyword } = this.get();

    const configs = await this.getConfigs();
    const categorys = await this.getCategory();

    const typpeEnum = [{
      article: 'article',
      bangumi: 'bangumi'
    }];
    const field = 'id,title,content,category_id,updatetime,imgurl';
    let SQL;
    let where = '';
    let list;
    const modelName = typpeEnum[type];
    if (keyword) {
      where += `where ((title LIKE '%${keyword}%') OR (content LIKE '%${keyword}%'))`;
      if (!think.isEmpty(modelName)) {
        SQL = `
          SELECT ${field},'${modelName}' as type FROM tl_${modelName} ${where}
        `;
      } else {
        SQL = `
          SELECT ${field},'article' as type FROM tl_article ${where} UNION ALL
          SELECT ${field},'bangumi' as type FROM tl_bangumi ${where}
        `;
      }

      const page = this.get('page') || 1;
      const pageSize = 20;
      const allData = await this.model('config').query(SQL);
      const count = allData.length;

      let data = allData.sort((a, b) => {
        return new Date(b.updatetime) - new Date(a.updatetime);
      });
      data = data.slice((page - 1) * pageSize, page * pageSize);

      for (const element of data) {
        const { id, title, category_id: categoryId, type, imgurl } = element;
        let content = element.content;
        const findCategory = categorys.find(item => item.id === categoryId);

        const _title = title.indexOf(keyword) > -1 ? title.replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`) : title;
        content = content.replace(/<.*?>/g, '');
        const keyIndex = content.indexOf(keyword);
        const start = keyIndex - 60 < 0 ? 0 : keyIndex - 60;
        const _content = keyIndex > -1
          ? content.substr(start, 130).replace(new RegExp(keyword, 'gi'), `<em>${keyword}</em>`)
          : content.substr(0, 130);

        let thumbX;
        let thumbY;
        if (type === 'bangumi') {
          thumbX = configs.thumb_bangumi_x;
          thumbY = configs.thumb_bangumi_y;
        } else {
          thumbX = configs.thumb_article_x;
          thumbY = configs.thumb_article_y;
        }

        const classList = categorys.filter(item => item.id === categoryId).map(item => {
          return {
            name: item.name,
            url: `/${item.type}/${item.id}`
          };
        });

        Object.assign(element, {
          title: _title,
          content: _content,
          url: `/${findCategory.type}/detail/${id}`,
          imgurl: await this.getThumbnail(imgurl, thumbX, thumbY, configs.thumb_kind),
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
