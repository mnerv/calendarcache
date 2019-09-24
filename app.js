const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const request = require('request')
const fs = require('fs')
const ics = require('ics')

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
async function getCalendar() {
  //https://schema.mau.se/setup/jsp/Schema.jsp?startDatum=idag&intervallTyp=m&intervallAntal=6&sprak=SV&sokMedAND=true&forklaringar=true&resurser=p.THMMA19h
  let link =
    'https://schema.mau.se/setup/jsp/Schema.jsp?startDatum=idag&intervallTyp=m&intervallAntal=6&sprak=SV&sokMedAND=true&forklaringar=true&resurser=p.THMMA19h'

  link = 'http://localhost:4000'

  request(link, (err, resp, body) => {
    console.log('error', err)

    console.log('statusCode:', resp && resp.statusCode) // Print the response status code if a response was received

    if (!err && resp.statusCode == 200) {
      fs.writeFileSync(__dirname + '/test/bruh.html', body)

      const dom = new JSDOM(body)

      const table = dom.window.document.querySelector('.schemaTabell')
      const tbody = table.querySelector('tbody')

      let csv = []
      let rows = tbody.querySelectorAll('tr')

      for (let i = 0; i < rows.length; i++) {
        let row = []
        const cols = rows[i].querySelectorAll('td, th')

        for (let j = 0; j < cols.length; j++) {
          const el = cols[j]
          const shitsInside = el.querySelector('div, a, nobr, b')

          let currentValue = ''
          if (shitsInside != null) {
            let testShits = el.querySelectorAll('div, a, nobr, b')

            if (testShits.length > 1)
              testShits.forEach((element, index) => {
                if (index == testShits.length - 1) currentValue += ' ; '
                currentValue += element.innerHTML
              })
            else currentValue = shitsInside.innerHTML
          } else {
            currentValue = el.innerHTML
          }

          currentValue = currentValue.replace(/&nbsp;/g, ' ')
          currentValue = currentValue.replace(/,/g, ';')
          row.push(currentValue)
        }

        csv.push(row.join(','))
      }

      let headers = csv[0].split(',')
      let datas = csv.slice(2)
      let year

      let events = []

      let currentDate
      let lastDate

      for (let i = 0; i < datas.length; i++) {
        let testForYear = datas[i].split(' ')

        if (testForYear[0] == 'Vecka') {
          year = testForYear[testForYear.length - 1]
        } else if (testForYear.length > 2) {
          let dataArray = datas[i].split(',')

          let startEnd
          let eventTitle
          let eventLocation
          let group
          let lessonInfo
          let lastUpdated

          if (headers.length == dataArray.length) {
            for (let i = 0; i < headers.length; i++) {
              let currentHeader = headers[i]
              if (currentHeader == 'Datum') {
                if (dataArray[i] != ' ') {
                  let dateString = (dataArray[i] + '-' + year)
                    .replace(/ /g, '-')
                    .replace('Okt', 'Oct')

                  currentDate = new Date(dateString)
                  lastDate = new Date(dateString)
                } else {
                  currentDate = lastDate
                }
              } else if (currentHeader == 'Start-Slut') {
                startEnd = dataArray[i].split('-')
              } else if (currentHeader == 'Kurs.grp') {
                eventTitle = dataArray[i]
              } else if (currentHeader == 'Grupp') {
                group = dataArray[i]
              } else if (currentHeader == 'Lokal') {
                eventLocation = dataArray[i]
              } else if (currentHeader == 'Moment') {
                lessonInfo = dataArray[i]
              } else if (currentHeader == 'Uppdat.') {
                lastUpdated = dataArray[i]
              }
            }
          }

          let timeString = currentDate.getFullYear() + '-'

          timeString +=
            (currentDate.getMonth() + 1).toString().length > 1
              ? currentDate.getMonth() + 1
              : '0' + (currentDate.getMonth() + 1).toString()
          timeString += '-'
          timeString +=
            currentDate.getDate().toString().length > 1
              ? currentDate.getDate().toString()
              : '0' + currentDate.getDate().toString()
          timeString += 'T'

          let startTimeS = timeString + startEnd[0]
          let endTimeArr = startEnd[1].split(':')

          let eventSTime = new Date(startTimeS.toString())
          let eventETime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            parseInt(endTimeArr[0]),
            parseInt(endTimeArr[1])
          )

          let tmpDesc = 'Moment: ' + lessonInfo
          tmpDesc += '\nGroup: ' + group
          tmpDesc += '\nLast Updated: ' + lastUpdated

          let event = {
            start: [
              eventSTime.getFullYear(),
              eventSTime.getMonth() + 1,
              eventSTime.getDate(),
              eventSTime.getHours(),
              eventSTime.getMinutes()
            ],
            end: [
              eventETime.getFullYear(),
              eventETime.getMonth() + 1,
              eventETime.getDate(),
              eventETime.getHours(),
              eventETime.getMinutes()
            ],
            startOutputType: 'local',
            title: eventTitle,
            description: tmpDesc,
            location: eventLocation,
            status: 'CONFIRMED'
          }

          events.push(event)
        }
      }

      ics.createEvents(events, (error, value) => {
        if (error) {
          console.log(error)
          return
        }

        fs.writeFileSync(__dirname + '/data/ics/latest.ics', value)
      })
    }
  })
}

// routes
app.get('/', (req, res, next) => {
  getCalendar().then(() => {
    res.status(200).json({
      nice: 'nice.'
    })
  })
})

app.get('/ics', (req, res, next) => {
  getCalendar().then(() => {
    res.status(200).sendFile(__dirname + '/data/ics/latest.ics')
  })
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
