import {
  ICS_EXT,
  JSON_EXT,
  CACHE_TIME
} from './../../config/env'

import { getManager, getRepository } from 'typeorm'
import { snow } from '../../config/token'
import { redis } from '../../config/cache'

import {
  fetchCalendar,
  parseCalendar,
  createEvents,
  saveCalendar,
  getCalendarURLType,
  readCalendarFile
} from './calendar.util'

import { CalendarEntity } from '../../entity/calendar.entity'
import {
  CalendarFileType,
  CalendarURLType,
  ICalendarCreate
} from '../../model/calendar.model'

const LEGAL_NAME = /^[A-Za-z0-9]+$/

export async function createCalendar(
  calendar: ICalendarCreate): Promise<string> {
  const { name, url } = calendar
  const urlType = getCalendarURLType(url, calendar.type)

  if (urlType == CalendarURLType.UNKNOWN)
    return Promise.reject('URL NOT SUPPORTED')
  if (name.match(LEGAL_NAME) === null)
    return Promise.reject(
      `ALLOWED CHARACTERS: ${LEGAL_NAME.source}`
    )

  const newCalendar = new CalendarEntity()
  newCalendar.name = name

  const manager = getManager()
  const repo = getRepository(CalendarEntity)

  try {
    if (await repo.findOne({ where: { name } }))
      throw new Error(`CALENDAR {${name}} EXIST!`)

    const html = await fetchCalendar(url)
    const csv = await parseCalendar(html, urlType)
    const events = await createEvents({ name, url, csv }, urlType)

    const filename = (await snow.asyncGetUniqueID()).toString()
    await saveCalendar(filename, events, CalendarFileType.ICS)
    await saveCalendar(filename, events, CalendarFileType.JSON)
    newCalendar.filename = filename
    newCalendar.cached_at = new Date()
    newCalendar.source = url
    newCalendar.url_type = urlType

    await manager.save(newCalendar)

    return Promise.resolve(name)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function findAllCalendars(): Promise<CalendarEntity[]> {
  try {
    return await getRepository(CalendarEntity).find()
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function getCalendar(rawName: string): Promise<{
  type: CalendarFileType,
  buffer: Buffer
}> {
  try {
    const name = rawName.replace(JSON_EXT, '').replace(ICS_EXT, '')
    const calendar = await getRepository(CalendarEntity)
      .findOne({ where: { name } })
    if (calendar) {
      const cachedFilename = await redis.get(name)
      if (cachedFilename === null) {
        const html = await fetchCalendar(calendar.source)
        const csv = await parseCalendar(html, calendar.url_type)
        const events = await createEvents(
          {
            name: calendar.name,
            url: calendar.source,
            csv
          }, calendar.url_type)
        await saveCalendar(calendar.filename, events, CalendarFileType.ICS)
        await saveCalendar(calendar.filename, events, CalendarFileType.JSON)

        redis.setex(calendar.name, CACHE_TIME, calendar.filename)
        calendar.cached_at = new Date()
      }

      let buffer: Buffer
      let type: CalendarFileType
      if (rawName.match(JSON_EXT)) {
        type = CalendarFileType.JSON
        buffer = await readCalendarFile(calendar.filename, type)
      } else {
        type = CalendarFileType.ICS
        buffer = await readCalendarFile(calendar.filename, type)
      }

      calendar.requests++
      await getManager().save(calendar)

      return Promise.resolve({ type, buffer })
    }
    else {
      return Promise.reject(`CALENDAR ${name} DOES NOT EXIST`)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
