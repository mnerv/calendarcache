const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const db = require('nedb')

const getCalendar = require('./functions/reqcalendar.js')

let link =
  'https://schema.mau.se/setup/jsp/Schema.jsp?startDatum=idag&intervallTyp=m&intervallAntal=6&sprak=SV&sokMedAND=true&forklaringar=true&resurser=p.THMMA19h'

link = 'http://localhost:4000'

createPrimaryFolders()

app.use(morgan('dev'))
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())
// app.use(cors())
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

app.use('/', express.static(path.join(__dirname, 'page')))

/////////////////// Functions /////////////////////
function createPrimaryFolders() {
  const rootData = path.join(__dirname, 'data')
  const icsPath = path.join(rootData, 'ics')
  const csvPath = path.join(rootData, 'csv')

  if (!fs.existsSync(rootData)) fs.mkdirSync(rootData)
  if (!fs.existsSync(icsPath)) fs.mkdirSync(icsPath)
  if (!fs.existsSync(csvPath)) fs.mkdirSync(csvPath)
}

////////////////////// ROUTES //////////////////////
app.get('/status', (req, res, next) => {
  getCalendar(link).then(value => {
    const timelog = new Date().toLocaleString()
    console.log('\x1b[34m' + timelog + '\x1b[0m')
    if (value.error) {
      console.log(
        '\x1b[31m/ / / / / / / / / / / / / ERROR / / / / / / / / / / / / /\x1b[0m'
      )
      console.log(value.error)
      console.log(
        '\x1b[31m/ / / / / / / / / / / / / ERROR / / / / / / / / / / / / /\x1b[0m'
      )
    } else console.log('statusCode:', '\x1b[33m', value.statusCode)

    res.status(200).json({ msg: 'it works, I think' })
  })
})

app.get('/latest.ics', (req, res, next) => {
  getCalendar(link).then((err, val) => {
    res.status(200).sendFile(__dirname + '/data/ics/latest.ics')
  })
})

////////////////// Default routes //////////////////
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
