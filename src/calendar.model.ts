import * as io from 'io-ts'

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
  name: io.string,
  source: io.array(io.string),
  id: io.string,
  created: IODate,
  updated: IODate,
})

export type TCalendarModel = io.TypeOf<typeof CalendarModel>
