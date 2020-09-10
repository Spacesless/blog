const path = require('path')
const fileSession = require('think-session-file')

/**
 * file session adapter config
 * @returns {Object}
 * @summary 该方案为session-cookie模式
 */
module.exports = {
  type: 'file',
  common: {
    secret: 'timeless',
    cookie: {
      name: 'thinkjs',
      length: 32,
      httponly: true,
      keys: ['thinkjs', 'koa2', 'nodejs'],
      signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}
