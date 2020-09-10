const JWTSession = require('think-session-jwt')

/**
 * jwt session adapter config
 * @return {Object}
 * @summary 该方案为jsonWebToken模式 (登录用jwt，但图片验证码不是无状态的，虽可md5后存cookie)
 *
 * 简单来说，如果你的用户数据可能需要和第三方共享，或者允许第三方调用 API 接口，用 Token ，
 * 如果只是自己的网站，面向浏览器用户，我觉得session-cookie机制也挺好的。
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
