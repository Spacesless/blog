const adminConfig = require('./config/nuxt.admin.js')
const frontConfig = require('./config/nuxt.front.js')

const isAdmin = process.argv.includes('--admin')

module.exports = isAdmin ? adminConfig : frontConfig
