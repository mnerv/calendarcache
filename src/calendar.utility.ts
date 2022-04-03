import axios from 'axios'
import redis from './config/redis'
import Hash from './config/hash'
import { CACHE_TIME } from './config/env'
import { EventModel, TEventModel } from './calendar.model'
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

async function loadCachedOrLive(source: string): Promise<string> {
  const id = Hash.toString(await Hash.hash(source))
  const cache = await redis.get(cacheKey(id))
  if (cache) return cache
  const html = await axios.get(source).then(res => res.data)
  await redis.setex(cacheKey(id), CACHE_TIME, html)
  return html
}

export async function loadEvent(source: string): Promise<TEventModel[]> {
  const html = await loadCachedOrLive(source)
  const supportType = CalSupport.getName(source)
  switch (supportType) {
  case Name.mau:
    return Promise.resolve(mau.parse(html))
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
  throw new Error('Not implemented')
}

export default {
  loadEvents,
  toICS: convertToICS,
}
