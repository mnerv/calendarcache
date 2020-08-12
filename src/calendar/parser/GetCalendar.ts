import path from 'path'
import request from 'request'
import Kronox from './KronoxMAU'
import createICSFile from './CreateICSFile'

const ROOT_DIR = path.resolve()

async function getCalendar(link: string, filename: string) {
  return new Promise((resolve, reject) => {
    if (link.includes(Kronox.URL_SIG))
      request(link, (err, resp, body) => {
        const status = resp && resp.statusCode

        if (!err && resp.statusCode === 200) {
          const csv = Kronox.HTMLToCSV(body)
          const events = Kronox.createEvent(csv)

          createICSFile(events, filename)
          resolve('File created')
        } else reject(err)
      })
    else reject('link not matched with parser url signature')
  })
}

export default getCalendar
