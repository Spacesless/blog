const JWTSession = require('think-session-jwt')

/**
 * session adapter config
 * @type {Object}
 */
module.exports = {
  type: 'jwt',
  common: {
    cookie: {
      name: 'thinkjs'
    }
  },
  jwt: {
    handle: JWTSession,
    secret: 'timeless', // secret is reqired
    tokenType: 'header', // ['query', 'body', 'header', 'cookie'], 'cookie' is default
    tokenName: 'authorization', // if tokenType not 'cookie', this will be token name, 'jwt' is default
    sign: {
      expiresIn: 24 * 60 * 60 * 1000
    }
  }
}
