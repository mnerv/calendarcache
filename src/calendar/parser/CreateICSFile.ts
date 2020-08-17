import fs from 'fs'
import path from 'path'
import { createEvents } from 'ics'
import { ROOT_DIR } from 'src/config/config'
import CalendarEvent from './CalendarEvent'

function createICS(events: CalendarEvent[], filename: string) {
  createEvents(events, (error, value) => {
    if (error) {
      console.log(error)
      return
    }
    fs.writeFileSync(path.join(ROOT_DIR, 'data/ics', filename), value)
  })
}

export default createICS
