const jsdom = require('jsdom')
const { JSDOM } = jsdom
const request = require('request')
const fs = require('fs')
const ics = require('ics')
const path = require('path')
const getFormatedTime = require('./formatedTime')

const rootPath = path.dirname(require.main.filename)

function convertCSV(htmlbody) {
  const dom = new JSDOM(htmlbody)

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

  return csv
}

function createEvents(csv) {
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
                .replace('Maj', 'May')

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
      tmpDesc += '\nLast Cache: ' + getFormatedTime()

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
  return events
}

function createICS(events) {
  ics.createEvents(events, (error, value) => {
    if (error) {
      console.log(error)
      return
    }

    fs.writeFileSync(rootPath + '/data/ics/latest.ics', value)
  })
}

async function getCalendar(link) {
  request(link, (err, resp, body) => {
    console.log(new Date().toLocaleString())
    console.log('error', err)
    console.log('statusCode:', resp && resp.statusCode) // Print the response status code if a response was received

    if (!err && resp.statusCode == 200) {
      // fs.writeFileSync(rootPath + '/bruh.html', body)

      let csv = convertCSV(body)

      let events = createEvents(csv)

      createICS(events)
    }
  })
}

module.exports = getCalendar
