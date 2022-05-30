import { JSDOM } from 'jsdom'
import { TEventModel } from '../calendar.model'
import { CalendarException, CalendarParseException } from './exceptions'

function dateToStr(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseMainTableToCSV(dom: JSDOM): string[][] {
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

function cleanMainTable(csv: string[][]): string[][] {
  const requiredHeaders = ['start', 'slut', 'kurs', 'grupp', 'sign', 'lokal', 'hjälp', 'moment', 'uppdat']
  const header = csv.shift()
  if (!header)
    throw new CalendarException('CSV Table missing header!')

  const outCSV: string[][] = []
  outCSV.push(requiredHeaders)
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
      case 'Datum': {
        if (col !== '' && col !== ' ') {
          const dateStr = (col.trim() + '-' + year)
            .replace(/ /g, '-')
            .replace('Okt', 'Oct')
            .replace('Maj', 'May')
          currentDate = new Date(dateStr)
          lastDate = currentDate
        } else currentDate = lastDate
        break
      }
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
    if (!startTime && !endTime && !title) continue
    const dateStr = dateToStr(currentDate)
    startTime = `${dateStr}T${startTime}`
    endTime   = `${dateStr}T${endTime}`

    const add = [
      startTime, endTime,
      title     ?? '', group    ?? '',
      signature ?? '', location ?? '',
      help      ?? '', moment   ?? '',
      updated   ?? ''
    ]
    outCSV.push(add)
  }
  return outCSV
}

function parseSignTableToCSV(dom: JSDOM): string[][] {
  const candidate = dom.window.document.querySelectorAll('tbody')
  const tableName = Array.from(candidate).find(el => el.innerHTML.includes('Signaturer'))
  if (!tableName) return []
  const rows = Array.from(tableName.querySelectorAll('tr'))
  const header = Array.from(rows[1].querySelectorAll('th')).map(el => el.innerHTML.trim())
  const csv: string[][] = []
  csv.push(header)
  rows.slice(2).forEach(row => {
    const cols = Array.from(row.querySelectorAll('td')).map(el => el.innerHTML.trim())
    csv.push(cols)
  })
  return csv
}

function parseLokalTableToCSV(dom: JSDOM): string[][] {
  const candidate = dom.window.document.querySelectorAll('tbody')
  const tableName = Array.from(candidate).find(el => el.innerHTML.includes('Lokaler'))
  if (!tableName) return []
  const rows = Array.from(tableName.querySelectorAll('tr'))
  const header = Array.from(rows[1].querySelectorAll('th')).map(el => el.innerHTML.trim())
  const csv: string[][] = []
  csv.push(header)

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].querySelectorAll('td')
    const cols: string[] = []
    for (let j = 0; j < row.length; j++) {
      if (header[j] === 'Mazemap') {
        const el = row[j].querySelector('a')
        if (el) cols.push(el.href)
        else cols.push('')
        continue
      }
      cols.push(row[j].innerHTML.trim())
    }
    if (cols.length > 0) csv.push(cols)
  }
  return csv
}

function createEvents(mainCSV: string[][], signCSV: string[][],
  lokalCSV: string[][], source: string): TEventModel[] {
  const events: TEventModel[] = []

  function signName(signature: string): string {
    const row = signCSV.find(row => row[0].trim() === signature)
    if (!row) return signature
    return row[1] + ' ' + row[2]
  }

  function mazeMap(id: string): string {
    const row = lokalCSV.find(row => row[0] === id)
    if (!row) return ''
    return `Mazemap: ${row[row.length - 1]}`
  }

  function formatLokal(id: string): string {
    const row = lokalCSV.find(row => row[0] === id)
    if (!row) return ''
    return `Lokal: ${row[3]} Våning: ${row[2]}, ${row[1]}`
  }

  for (let i = 1; i < mainCSV.length; i++) {
    const row = mainCSV[i]
    const start = `${row[0]}:00.000+02:00`
    const end   = `${row[1]}:00.000+02:00`

    const title     = row[2].split(',')[0] + ', ' + row[7]
    const location  = row[5]
    let description = ''
    description += row[2] + '\n'
    description += '\n'

    description += row[3] ? `Grupp: ${row[3]}\n`    : ''
    description += row[4] ? `Signatur: ${signName(row[4])}\n` : ''
    description += row[5] ? `Plats: ${row[5]}\n`    : ''
    description += row[7] ? `Moment: ${row[7]}\n`   : ''
    description += row[5] ? `${formatLokal(row[5])}\n` : ''
    description += '\n'

    description += row[8] ? `updated: ${row[8]}\n` : ''
    description += `cached: ${new Date().toISOString()}\n`
    description += `source: ${source}\n`
    description += row[5] ? `${mazeMap(row[5])}\n` : ''

    const event: TEventModel = {
      start: new Date(start),
      end: new Date(end),
      title,
      description,
      location,
      url: source,
    }
    events.push(event)
  }
  return events
}

function parse(str: string, source: string): TEventModel[] {
  const dom = new JSDOM(str)
  const mainTable  = parseMainTableToCSV(dom)
  const signTable  = parseSignTableToCSV(dom)
  const lokalTable = parseLokalTableToCSV(dom)

  const events = createEvents(mainTable, signTable, lokalTable, source)
  return events
}

export default { parse }
