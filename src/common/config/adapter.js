exports.cache = require('./adapter/cache')

exports.model = require('./adapter/model')

exports.session = require('./adapter/session')
// 需要把think-session-file 替换成 think-session-jwt
// exports.session = require('./adapter/session-jwt')

exports.view = require('./adapter/view')

exports.logger = require('./adapter/logger')
