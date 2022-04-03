import axios from 'axios'
import * as ics from 'ics'

import redis from './config/redis'
import Hash from './config/hash'
import { CACHE_TIME } from './config/env'
import { TEventModel } from './calendar.model'
import CalSupport, { Name } from './calendars/supported'
import { CalendarException } from './calendars/exceptions'

import mau from './calendars/mau.se'

function sourceKey(id: string): string {
  return `source:${id}`
}
function cacheKey(id: string): string {
  return `cache:${id}`
}
function htmlKey(id: string): string {
  return `html:${id}`
}

async function cachedHTMLorLive(source: string): Promise<string> {
  const id = Hash.toString(await Hash.hash(source))
  const cache = await redis.get(htmlKey(id))
  if (cache) return cache
  const html = await axios.get(source).then(res => res.data)
  await redis.setex(htmlKey(id), CACHE_TIME, html)
  return html
}

export async function loadEvent(source: string): Promise<TEventModel[]> {
  const html = await cachedHTMLorLive(source)
  const supportType = CalSupport.getName(source)

  switch (supportType) {
  case Name.mau:
    return Promise.resolve(mau.parse(html, source))
  default:
    return Promise.reject(new CalendarException('Calendar not supported'))
  }
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
