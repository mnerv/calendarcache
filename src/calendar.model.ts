import * as io from 'io-ts'

export function calendarKey(id: string): string {
  return `calendar:${id}`
}

export const CalendarCreate = io.type({
  name: io.string,
  url: io.union([io.string, io.array(io.string)]),
})
export type TCalendarCreate = io.TypeOf<typeof CalendarCreate>

const IODate = new io.Type<Date, Date, unknown>(
  'Date',
  (input: unknown): input is Date =>
    typeof input === 'object' && input instanceof Date,
  (input, context) => (typeof input === 'object' &&
   input instanceof Date ? io.success(input) : io.failure(input, context)),
  io.identity
)

export const CalendarModel = io.type({
  name:    io.string,
  source:  io.array(io.string),
  id:      io.string,
  created: io.union([IODate, io.string]),
  updated: io.union([IODate, io.string]),
})
export type TCalendarModel = io.TypeOf<typeof CalendarModel>

// https://icalendar.org/RFC-Specifications/iCalendar-RFC-5545/
export const EventModel = io.type({
  start: IODate,
  end:   IODate,
  title: io.string,
  description: io.union([io.string, io.null]),
  location:    io.union([io.string, io.null]),
  url:         io.union([io.string, io.null]),
})
export type TEventModel = io.TypeOf<typeof EventModel>

export default {
  key: calendarKey,
}
