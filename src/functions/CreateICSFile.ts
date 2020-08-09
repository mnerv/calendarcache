import fs from 'fs'
import path from 'path'
import consola from 'consola'
import { createEvents } from 'ics'

const ROOT_DIR = path.join(__dirname, '..', '..')

function createICS(events: any[], filename: string) {
  createEvents(events, (error, value) => {
    if (error) {
      console.log(error)
      return
    }

    fs.writeFileSync(path.join(ROOT_DIR, 'data/ics', filename), value)
  })
}

export default createICS
