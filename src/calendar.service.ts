import { isLeft } from 'fp-ts/lib/Either'
import redis from './config/redis'
import { DELETE_TIME } from './config/env'
import CModel, {
  TCalendarModel,
  CalendarModel,
} from './calendar.model'
import Hash from './config/hash'

import CalSupport, { CalendarFile } from './calendars/supported'
import {
  CalendarException,
  CalendarSupportException
} from './calendars/exceptions'
import CalendarUtility from './calendar.utility'

export async function createCalendar(name: string, url: string[]): Promise<void> {
  for (const u of url) {
    if (!CalSupport.isSupported(u))
      throw new CalendarSupportException(`Calendar with url '${url}' is not supported`)
  }

  const str = await redis.keys('calendar:*')
  const id = Hash.toString(await Hash.hash(name))

  const found = str.findIndex(s => s === CModel.key(id))
  if (found !== -1)
    throw new CalendarException(`Calendar ${name} already exists`)

  const calendar: TCalendarModel = {
    name: name,
    source: url,
    id: id,
    created: new Date(),
    updated: new Date(),
  }
  await redis.set(CModel.key(id), JSON.stringify(calendar))
}

export async function readCalendar(name: string): Promise<object> {
  const id = Hash.toString(await Hash.hash(name))
  const str = await redis.get(CModel.key(id))
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
  const str = await redis.keys('calendar:*')
  return str.map(s => s.replace('calendar:', ''))
}

export async function listCalendarInfo(): Promise<TCalendarModel[]> {
  const strs = await redis.keys('calendar:*')
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
  const str = await redis.getdel(CModel.key(id))
  if (!str) return Promise.reject(new CalendarException(`Calendar ${id} not found`))
  await redis.setex(CModel.key(id), DELETE_TIME, str)
}

export async function cancelDeleteCalendar(id: string): Promise<void> {
  const str = await redis.get(CModel.key(id))
  if (!str) return Promise.reject(new CalendarException(`Calendar ${id} not found`))
  await redis.set(CModel.key(id), str)
}

export async function loadCalendarEvents(type: CalendarFile, name: string): Promise<string> {
  const id = Hash.toString(await Hash.hash(name))
  const str = await redis.get(CModel.key(id))
  if (!str) throw new CalendarException(`Calendar ${name} not found`)
  const json = JSON.parse(str)
  const decode = CalendarModel.decode(json)
  if (isLeft(decode))  // TODO: Handle when CalendarModel is changed
    throw new CalendarException(`Error decoding calendar data ${name} not found`)

  const calendar = decode.right
  const events = await CalendarUtility.loadEvents(calendar.source)

  switch (type) {
  case CalendarFile.ICS:
    return CalendarUtility.toICS(events)
  case CalendarFile.JSON:
    return JSON.stringify(events)
  default:
    throw new CalendarException(`Calendar ${name} not found`)
  }
}

export default {
  create: createCalendar,
  read: readCalendar,
  info: calendarInfo,
  edit: editCalendar,
  list: listCalendar,
  listInfo: listCalendarInfo,
  delete: deleteCalendar,
  loadEvents: loadCalendarEvents,
}
