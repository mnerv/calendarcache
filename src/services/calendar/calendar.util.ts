import fs from 'fs'
import path from 'path'
import * as ics from 'ics'
import fetch from 'node-fetch'

import {
  ICS_EXT,
  ICS_PATH,
  JSON_EXT,
  JSON_PATH,
  IS_PRODUCTION,
} from '../../config/env'

import {
  CalendarURLType,
  CalendarFileType,
  IEventCreate,
  ICalendarEvent,
} from '../../model/calendar.model'

import {
  MAU_URL,
  mauParser,
  mauCreateEvents
} from './parser/mau'

export async function fetchCalendar(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fetch(url).then(res => {
      if (res.ok) return res.text()
      else reject('Failed to fetch calendar')
    }).then(text => {
      if (text) resolve(text)
      else reject('Fetched data is empty')
    }).catch(err => reject(err))
  })
}

export async function parseCalendar(html: string,
  type: CalendarURLType): Promise<string[]> {
  switch (type) {
  case CalendarURLType.MAU:
    return Promise.resolve(mauParser(html))
  default:
    return Promise.reject('CALENDAR TYPE NOT SUPPORTED')
  }
}

export async function createEvents(events: IEventCreate,
  type: CalendarURLType): Promise<ICalendarEvent[]> {
  switch (type) {
  case CalendarURLType.MAU:
    return Promise.resolve(mauCreateEvents(events.csv, events.url))
  default:
    return Promise.reject('CALENDAR TYPE NOT SUPPORTED')
  }
}

export async function saveCalendar(
  filename: string,
  events: ICalendarEvent[],
  type: CalendarFileType
): Promise<string> {
  switch (type) {
  case CalendarFileType.ICS:
    return new Promise<string>((resolve, reject) => {
      ics.createEvents(events, (err, file) => {
        if (err) reject(err)
        else fs.writeFile(path.join(ICS_PATH, filename + ICS_EXT.source),
          file,
          err => {
            if (err) reject(err)
            else resolve(filename)
          })
      })
    })
  case CalendarFileType.JSON:
    return new Promise<string>((resolve, reject) => {
      fs.writeFile(path.join(JSON_PATH, filename + JSON_EXT.source),
        JSON.stringify(events),
        (err) => {
          if (err) reject(err)
          else resolve(filename)
        })
    })
  case CalendarFileType.UNKNOWN:
    return Promise.reject('FILE TYPE NOT SUPPORTED')
  }
}

export async function readCalendarFile(
  filename: string, type: CalendarFileType): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    switch (type) {
    case CalendarFileType.ICS:
      fs.readFile(path.join(ICS_PATH, filename + ICS_EXT.source),
        (err, data) => {
          if (err) reject('Error reading file')
          else resolve(data)
        })
      break

    case CalendarFileType.JSON:
      fs.readFile(path.join(JSON_PATH, filename + JSON_EXT.source),
        (err, data) => {
          if (err) reject('Error reading file')
          else resolve(data)
        })
      break

    default:
      reject('File type not supported')
      break
    }
  })
}

export function getCalendarURLType(
  url: string, type?: number): CalendarURLType {
  if (type !== undefined && !IS_PRODUCTION) return type
  else if (url.includes(MAU_URL))
    return CalendarURLType.MAU
  else return CalendarURLType.UNKNOWN
}
