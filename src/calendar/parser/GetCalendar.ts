import request from 'request'
import { createEvent, HTMLToCSV, URL_SIG } from './KronoxMAU'
import createICSFile from './CreateICSFile'
import config from 'src/config/config'

async function getCalendar(link: string, filename: string) {
  return new Promise<string>((resolve, reject) => {
    if (link.includes(URL_SIG) || config.override_url)
      request(link, (err, resp, body) => {
        const status = resp && resp.statusCode

        if (!err && resp.statusCode === 200) {
          const csv = HTMLToCSV(body)
          const events = createEvent(csv, link)

          createICSFile(events, filename)
          resolve('File created')
        } else reject(err)
      })
    else reject('link not matched with parser url signature')
  })
}

export default getCalendar
