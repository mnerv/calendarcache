import axios from 'axios'
import consola from 'consola'
import * as ics from 'ics'
import { isRight } from 'fp-ts/lib/Either'

import redis from './config/redis'
import Hash from './config/hash'
import { CACHE_TIME, APP_VERSION } from './config/env'
import { TEventModel, EventModel } from './calendar.model'
import CalSupport, { Name } from './calendars/supported'
import { CalendarException } from './calendars/exceptions'

import mau from './calendars/mau.se'

async function loadEventsLive(source: string): Promise<TEventModel[]> {
  const html = await axios.get(source).then(res => res.data)
  const supportType = CalSupport.getName(source)
  switch (supportType) {
  case Name.mau:
    return Promise.resolve(mau.parse(html, source))
  default:
    return Promise.reject(new CalendarException('Calendar not supported'))
  }
}

async function validateEvents(raw: string): Promise<TEventModel[]> {
  const events: TEventModel[] = []
  function dateTimeReviver(key: unknown, value: unknown) {
    if (typeof value === 'string' && (key === 'start' || key === 'end'))
      return new Date(value)
    return value
  }
  try {
    const json = JSON.parse(raw, dateTimeReviver)
    if (Array.isArray(json))
      json.forEach(e => {
        const decode = EventModel.decode(e)
        if (isRight(decode)) events.push(decode.right)
      })
  } catch (e) {
    consola.error({ message: e })
  }
  return events
}

// TODO: Add support for archiving events
export async function loadEvent(source: string): Promise<TEventModel[]> {
  const id = Hash.toString(await Hash.hash(source))
  const str = await redis.get(`cache:events:${id}`)

  if (str) {
    const evts = await validateEvents(str)
      .then(evs => evs)
      .catch(err => {
        consola.error(err)
        return null
      })
    if (evts) return evts
    else await redis.del(`cache:events:${id}`)
  }

  try {
    const live = await loadEventsLive(source)
    const jsonStr = JSON.stringify(live)
    await redis.set(`events:${id}`, jsonStr)
    await redis.setex(`cache:events:${id}`, CACHE_TIME, jsonStr)
    return live
  } catch (err) {
    const str = await redis.get(`events:${id}`)
    if (str) return await validateEvents(str)
  }
  return []
}

export async function loadEvents(sources: string[]): Promise<TEventModel[]> {
  const events: TEventModel[] = []
  for (const source of sources) {
    events.push(...(await loadEvent(source)))
  }
  return events
}

export async function convertToICS(events: TEventModel[]): Promise<string> {
  const icsEvents = await Promise.all(events.map(async e => {
    const { start, end, title, description, location, url } = e
    const icsStart: ics.DateArray = [
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
    ]
    const icsEnd: ics.DateArray = [
      end.getUTCFullYear(),
      end.getUTCMonth() + 1,
      end.getUTCDate(),
      end.getUTCHours(),
      end.getUTCMinutes(),
    ]
    return {
      start: icsStart,
      end: icsEnd,
      title,
      description,
      location,
      url,
      status: 'CONFIRMED',
      startInputType: 'utc',
      endInputType: 'utc',
      startOutputType: 'utc',
      endOutputType: 'utc',
      productId: `calendarcache/${APP_VERSION}`
    } as ics.EventAttributes
  }))

  return new Promise<string>((resolve, reject) => {
    ics.createEvents(icsEvents, (err, value) => {
      if (err) return reject(err)
      resolve(value)
    })
  })
}

export default {
  loadEvents,
  toICS: convertToICS,
}
