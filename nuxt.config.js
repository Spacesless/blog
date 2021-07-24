const adminConfig = require('./config/admin.conf.js')
const webConfig = require('./config/web.conf.js')

const isAdmin = process.argv.includes('--admin')

module.exports = isAdmin ? adminConfig : webConfig
