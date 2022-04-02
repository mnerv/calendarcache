import redis from './config/redis'
import { TCalendarModel } from './calendar.model'
import Hash from './config/hash'

import CalSupport from './calendars/supported'
import {
  CalendarException,
  CalendarSupportException
} from './calendars/exceptions'

export async function createCalendar(name: string, url: string[]): Promise<void> {
  for (const u of url) {
    if (!CalSupport.isSupported(u))
      throw new CalendarSupportException(`Calendar with url '${url}' is not supported`)
  }

  const str = await redis.keys('calendars:*')
  const id = Hash.toString(await Hash.hash(name))

  const found = str.findIndex(s => s === `calendars:${id}`)
  if (found !== -1)
    throw new CalendarException(`Calendar ${name} already exists`)

  const newCalendar: TCalendarModel = {
    name,
    source: url,
    id: id,
    created: new Date(),
    updated: new Date(),
  }
  await redis.set(`calendars:${id}`, JSON.stringify(newCalendar))
}

export async function readCalendar(name: string): Promise<object> {
  const str = await redis.get(`calendar:${name}`)
  if (str === null) return Promise.reject(new Error('Calendar not found'))
  const json = JSON.parse(str)
  return Promise.resolve(json)
}

export async function calendarInfo(name: string): Promise<string> {
  throw new Error('Not implemented')
}

export async function editCalendar(): Promise<void> {
  throw new Error('Not implemented')
}

export async function listCalendar(): Promise<string[]> {
  const str = await redis.keys('calendars:*')
  return str.map(s => s.replace('calendars:', ''))
}

export async function listCalendarInfo(): Promise<TCalendarModel[]> {
  const strs = await redis.keys('calendars:*')
  const list: TCalendarModel[] = []
  for (const id of strs) {
    const str = await redis.get(id)
    if (!str) continue
    try {
      const json = JSON.parse(str)
      list.push(json)
    } catch (err) {
      console.error(err)
    }
  }
  return list
}

export async function deleteCalendar(id: string): Promise<void> {
  await redis.del(`calendars:${id}`)
}

export default {
  create: createCalendar,
  read: readCalendar,
  info: calendarInfo,
  edit: editCalendar,
  list: listCalendar,
  listInfo: listCalendarInfo,
  delete: deleteCalendar,
}
