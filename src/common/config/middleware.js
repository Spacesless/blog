const path = require('path');
const isDev = think.env.includes('development');
const isStaging = think.env === 'development.local';
const nuxt = require('./middleware/nuxt');
const nuxtConfig = require(path.join(think.ROOT_PATH, '/nuxt.config.js'));

const middleware = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(assets|static|upload|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev,
      templates: path.join(think.ROOT_PATH, 'view', 'error')
    }
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '80mb',
      multiples: true
    }
  },
  {
    handle: 'router',
    options: {}
  },
  'logic',
  'controller'
];

if(!isStaging) {
  middleware.push({
    handle: nuxt,
    options: {
      config: nuxtConfig,
      unless: [/^\/cms?/, /^\/tl-admin?/, /^\/api?/, 'sitemap', 'rss', 'download'],
      isDev
    }
  })
}

module.exports = middleware
