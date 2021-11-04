const adminConfig = require('./config/nuxt.admin.js')
const webConfig = require('./config/nuxt.web.js')

const isAdmin = process.argv.includes('--admin')

module.exports = isAdmin ? adminConfig : webConfig
