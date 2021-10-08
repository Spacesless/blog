const path = require('path');
const mysql = require('think-model-mysql');

let config = {};
try {
  config = require(path.join(think.ROOT_PATH, 'config/database.conf.js'));
} catch (e) {
  think.logger.debug(e);
}

const isDev = think.env === 'development';
const { database, prefix, encoding, host, port, user, password } = config;

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
    database: database || 'Timeless',
    prefix: prefix || 'tl_',
    encoding: encoding || 'utf8',
    host: host || '127.0.0.1',
    port: port,
    user: user,
    password: password,
    dateStrings: true,
    pagesize: 20
  }
};
