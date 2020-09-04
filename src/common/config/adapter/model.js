const mysql = require('think-model-mysql')
const isDev = think.env === 'development'

/**
 * model adapter config
 * @type {Object}
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
    database: 'nuxt',
    prefix: 'tl_',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: '',
    user: 'root',
    password: 'root',
    dateStrings: true,
    pagesize: 20
  }
}
