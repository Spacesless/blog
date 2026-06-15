const path = require('path');

const isDev = think.env === 'development';

const middleware = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev,
      sendPowerBy: false
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
      debug: isDev
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

module.exports = middleware;
