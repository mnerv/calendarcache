import { JSDOM } from 'jsdom'
import CalendarEvent from './CalendarEvent'

export const URL_SIG: string = 'https://schema.mau.se/setup/jsp/Schema.jsp'

/**
 * Parse html body to csv (Comma-separated values)
 * @param html html body in string
 */
export function HTMLToCSV(html: string) {
  const dom = new JSDOM(html)
  const table = dom.window.document.querySelector('.schemaTabell') as Element

  let csv = []
  let rows = table.querySelectorAll('tr')

  const rowLength = rows.length
  let colLength = 0

  for (let i = 0; i < rowLength; i++) {
    let row = []
    const cols = rows[i].querySelectorAll('td, th')
    colLength = cols.length

    for (let j = 0; j < colLength; j++) {
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

export function createEvent(csv: string[], url: string = '') {
  const headers = csv[0].split(',')
  const datas = csv.slice(2)
  let year

  let events: CalendarEvent[] = []

  let currentDate!: Date
  let lastDate!: Date

  const tmpTZ = process.env.TZ
  process.env.TZ = 'Europe/Stockholm' // Set timezone the calendar is fetched from

  for (let i = 0; i < datas.length; i++) {
    let testForYear = datas[i].split(' ')

    if (testForYear[0] == 'Vecka') {
      year = testForYear[testForYear.length - 1]
    } else if (testForYear.length > 2) {
      let dataArray = datas[i].split(',')

      let startEnd!: string[]
      let eventTitle!: string
      let eventLocation!: string
      let group!: string
      let lessonInfo!: string
      let lastUpdated!: string

      if (headers.length !== dataArray.length) break

      for (let i = 0; i < headers.length; i++) {
        const currentHeader = headers[i]
        switch (currentHeader) {
          case 'Datum':
            if (dataArray[i] != ' ') {
              const dateString = (dataArray[i] + '-' + year)
                .replace(/ /g, '-')
                .replace('Okt', 'Oct')
                .replace('Maj', 'May')
              currentDate = new Date(dateString)
              lastDate = new Date(dateString)
            } else currentDate = lastDate
            break
          case 'Start-Slut':
            startEnd = dataArray[i].split('-')
            break
          case 'Kurs.grp':
          case 'Program':
            eventTitle = dataArray[i]
            eventTitle = eventTitle.replace(/;| ;/g, ',')
            break
          case 'Grupp':
            group = dataArray[i]
            break
          case 'Lokal':
            eventLocation = dataArray[i]
            break
          case 'Moment':
            lessonInfo = dataArray[i]
            lessonInfo = lessonInfo.replace(/<br>/g, ' | ')
            lessonInfo = lessonInfo.replace(/\<.*?\>/g, '')
            lessonInfo = lessonInfo.replace(/<|>/g, '')
            break
          case 'Uppdat.':
            lastUpdated = dataArray[i]
          default:
            break
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

      const startTimeS = timeString + startEnd[0]

      const endTimeArr = startEnd[1].split(':')

      const eventSTime = new Date(startTimeS.toString())

      let eventETime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(endTimeArr[0]),
        parseInt(endTimeArr[1])
      )

      let description = 'Moment: ' + lessonInfo.replace(';', ', ')
      if (group != ' ') description += '\nGroup: ' + group
      description += '\n' + eventTitle
      description += '\n\nLast Updated: ' + lastUpdated
      description += '\nLast Cache: ' + new Date().toString()

      const e = new CalendarEvent()
      e.start = [
        eventSTime.getUTCFullYear(),
        eventSTime.getUTCMonth() + 1, // offset the months from 0 to 1
        eventSTime.getUTCDate(),
        eventSTime.getUTCHours(),
        eventSTime.getUTCMinutes(),
      ]
      e.end = [
        eventETime.getUTCFullYear(),
        eventETime.getUTCMonth() + 1, // offset the months from 0 to 1
        eventETime.getUTCDate(),
        eventETime.getUTCHours(),
        eventETime.getUTCMinutes(),
      ]
      e.startOutputType = 'utc'
      e.title = eventTitle.split(',')[0] + ', ' + lessonInfo.split(';')[0]
      e.description = description
      e.location = eventLocation
      e.status = 'CONFIRMED'
      e.url = url

      events.push(e)
    }
  }

  // Reset to system timezone if it exist
  process.env.TZ = tmpTZ
  return events
}
