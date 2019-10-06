const http = require('http')
const app = require('./app.js')

const port = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(port, () => {
  console.log('listening on port:', '\x1b[32m', port, '\x1b[0m')
})
