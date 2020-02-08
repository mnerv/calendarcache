const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const { createPrimaryFolders } = require('./functions/checkfolders')
const calendar = require('./router/calendar')

const app = express()

createPrimaryFolders()

app.use(morgan('dev'))
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    res.status(200).json({
      msg: "there's nothing here yet..."
    })
  }
  next()
})

// / / / / / / / / / / Routes  / / / / / / / / / / / /
app.use('/api/calendar', calendar)

module.exports = app
