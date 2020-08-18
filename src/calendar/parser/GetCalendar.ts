import path from 'path'
import request from 'request'
import Kronox from './KronoxMAU'
import createICSFile from './CreateICSFile'
import config, { ROOT_DIR } from 'src/config/config'

async function getCalendar(link: string, filename: string) {
  return new Promise<string | any>((resolve, reject) => {
    if (link.includes(Kronox.URL_SIG) || config.override_url)
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
