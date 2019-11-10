const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')

const getCalendar = require('./functions/reqcalendar.js')

let link =
  'https://schema.mau.se/setup/jsp/Schema.jsp?startDatum=idag&intervallTyp=m&intervallAntal=6&sprak=SV&sokMedAND=true&forklaringar=true&resurser=p.THMMA19h'
createPrimaryFolders()

app.use(morgan('dev'))
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

// functions
function createPrimaryFolders() {
  if (!fs.existsSync(__dirname + '/data')) fs.mkdirSync(__dirname + '/data')
  if (!fs.existsSync(__dirname + '/data/ics'))
    fs.mkdirSync(__dirname + '/data/ics')
  if (!fs.existsSync(__dirname + '/data/csv'))
    fs.mkdirSync(__dirname + '/data/csv')
}

// routes
app.get('/', (req, res, next) => {
  getCalendar(link).then(() => {
    res.status(200).json({ msg: 'it works, I think' })
  })
})

app.get('/lates.ics', (req, res, next) => {
  getCalendar(link).then(() => {
    res.status(200).sendFile(__dirname + '/data/ics/latest.ics')
  })
  // res.status(200).json({
  //   msg: 'sorry nothing here yet :('
  // })
})

// Default routes
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
