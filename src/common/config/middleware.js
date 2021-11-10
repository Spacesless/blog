const path = require('path');
const nuxt = require('./middleware/nuxt');

const isDev = think.env === 'development';

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
      publicPath: /^\/(static|upload|favicon\.ico)/
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
  'controller',
  {
    handle: nuxt,
    enable: !process.argv.includes('--api'), // 如果node进程参数中存在--api，表示只运行api不需要nuxt中间件
    match: ctx => {
      const unless = [/^\/admin?/, /^\/web?/, 'sitemap', 'rss'];
      for (const item of unless) {
        if (ctx.url.match(item)) {
          return false;
        } else {
          return true;
        }
      }
    },
    options: {
      isDev
    }
  }
];

module.exports = middleware;
