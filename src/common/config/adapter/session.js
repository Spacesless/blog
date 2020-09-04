const path = require('path')
const fileSession = require('think-session-file')

exports.session = {
  type: 'file',
  common: {
    secret: '!N71PV5J',
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
