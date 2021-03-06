const mysql = require('think-model-mysql')
const isDev = think.env === 'development'

/**
 * model adapter config
 * @return {Object}
 */
module.exports = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    // database: 'nuxt',
    // prefix: 'tl_',
    // encoding: 'utf8',
    // host: '127.0.0.1',
    // port: '',
    // user: 'root',
    // password: 'root',
    database: 'Timeless',
    prefix: 'tl_',
    encoding: 'utf8',
    host: '159.75.89.66',
    port: '3366',
    user: 'Timeless1018',
    password: 'TimeH5go',
    dateStrings: true,
    pagesize: 20
  }
}
