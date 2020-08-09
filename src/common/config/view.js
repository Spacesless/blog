const nunjucks = require('think-view-nunjucks');
const moment = require('moment');
const path = require('path');
const isDev = think.env.includes('development');

module.exports = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks,
    beforeRender(env, nunjucks, config) {
      env.addGlobal('think', think);
      env.addFilter('substr', (str, index, length) => (str ? str.substr(index, length) : ''));
      /**
       * 格式化时间
       * @param {String} format YYYY-MM-DD HH:mm:ss
       */
      env.addFilter('moment', function(time, format) {
        moment.locale('zh-cn');
        if (think.isEmpty(time)) time = new Date();
        if (think.isEmpty(format)) {
          return moment(time).fromNow();
        } else {
          return moment(time).format(format);
        }
      });
      env.addFilter('xml', str => {
        // eslint-disable-next-line no-control-regex
        const NOT_SAFE_IN_XML = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;
        return str.replace(NOT_SAFE_IN_XML, '');
      });
    },
    options: {
      tags: {
        variableStart: '{$',
        variableEnd: '$}'
      }
    }
  }
};
