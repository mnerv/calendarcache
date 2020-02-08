const path = require('path')

const isProd = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000
const rootDir = path.dirname(require.main.filename)
const REDIS_PORT = 6379

module.exports = { PORT, REDIS_PORT, isProd, rootDir }
