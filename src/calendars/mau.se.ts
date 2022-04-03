import { JSDOM } from 'jsdom'
import { TEventModel } from '../calendar.model'
import { CalendarException } from './exceptions'

const delimiter = '\t'

function dateToStr(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseMainTableToCSV(str: string): string {
  const dom = new JSDOM(str)
  const mainTable = dom.window.document.querySelector('.schemaTabell') as Element
  const mainRows = mainTable.querySelectorAll('tr')
  const csv: string[][] = []
  for (let i = 0; i < mainRows.length; i++) {
    const row = mainRows[i]
    const col = row.querySelectorAll('td, th')
    const cols: string[] = []
    for (let j = 0; j < col.length; j++) {
      const element = col[j]
      const content = element.querySelector('div, a, nobr, b')
      let current = ''
      if (content) {
        const children = content.querySelectorAll('div, a, nobr, b')
        if (children.length > 1)
          children.forEach((el, i) => {
            if (i === children.length - 1) current += ';'
            current += el.innerHTML
          })
        else
          current = content.innerHTML
      } else {
        current = element.innerHTML
      }

      current = current.replace(/&nbsp;/g, ' ')
      current = current.replace(/&amp;/g, '&')
      current = current.replace(/,/g, ';')
      current = current.replace(/<br>/g, '')
      cols.push(current.trim())
    }
    csv.push(cols)
  }
  return cleanMainTable(csv)
}

function cleanMainTable(csv: string[][]): string {
  const requiredHeaders = ['start', 'slut', 'kurs', 'grupp', 'sign', 'lokal', 'hjälp', 'moment', 'uppdat']
  const header = csv.shift()
  if (!header)
    throw new CalendarException('CSV Table missing header!')

  const outCSV: string[] = []
  outCSV.push(requiredHeaders.join(delimiter))
  let currentDate!: Date
  let lastDate!: Date
  let year: string | null = null
  for (let i = 0; i < csv.length; i++) {
    const row = csv[i]
    if (row[0].startsWith('Vecka')) {
      year = row[0].split(';')[1].trim()
      continue
    }
    if (!year) continue

    let startTime: string | null = null
    let endTime:   string | null = null
    let title:     string | null = null
    let group:     string | null = null
    let signature: string | null = null
    let location:  string | null = null
    let help:      string | null = null
    let moment:    string | null = null
    let updated:   string | null = null

    for (let j = 0; j < row.length; j++) {
      const col = row[j]
      switch (header[j]) {
      case 'Datum':
        if (col !== ' ') {
          const dateStr = (col.trim() + '-' + year)
            .replace(/ /g, '-')
            .replace('Okt', 'Oct')
            .replace('Maj', 'May')
          currentDate = new Date(dateStr)
          lastDate = new Date(dateStr)
        } else currentDate = lastDate
        break
      case 'Start-Slut':{
        [startTime, endTime] = col.split('-')
        break
      }
      case 'Kurs.grp':
      case 'Program':
        title = col.replace(/;| ;/g, ',')
        break
      case 'Grupp':
        group = col
        break
      case 'Sign':
        signature = col
        break
      case 'Lokal':
        location = col
        break
      case 'Hjälpm.':
        help = col
        break
      case 'Moment':
        moment = col
        break
      case 'Uppdat.':
        updated = col
        break
      }
    }
    if (!startTime && !endTime && (!title || title === '')) continue
    const dateStr = dateToStr(currentDate)
    startTime = `${dateStr}T${startTime}`
    endTime   = `${dateStr}T${endTime}`

    const add = [startTime, endTime, title, group, signature, location, help, moment, updated]
    outCSV.push(add.join(delimiter))
  }
  return outCSV.join('\n')
}

function createEvents(csv: string): TEventModel[] {
  throw new Error('Not implemented')
}

function parse(str: string): TEventModel[] {
  const mainTable = parseMainTableToCSV(str)
  const events = createEvents(mainTable)
  return events
}

export default { parse }
