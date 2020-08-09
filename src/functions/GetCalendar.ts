import fs from 'fs'
import path from 'path'
import ics from 'ics'
import request from 'request'
import Kronox from './parser/KronoxMAU'

const ROOT_DIR = path.join(__dirname, '..', '..')
async function getCalendar(link: string) {
  return new Promise<boolean>((resolve, reject) => {
    request(link, (err, resp, body) => {
      const status = resp && resp.statusCode

      if (!err && resp.statusCode === 200) {
        const csv = Kronox.HTMLToCSV(body)
        const events = Kronox.createEvent(csv)

        console.log(events[0])

        resolve(true)
      } else reject(false)
    })
  })
}

export default getCalendar
