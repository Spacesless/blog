const nunjucks = require('think-view-nunjucks');
const path = require('path');

/**
 * view adapter config
 * @type {Object}
 */
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
