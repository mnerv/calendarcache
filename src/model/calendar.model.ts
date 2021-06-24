export interface ICalendar {
  name: string
}

export interface ICalendarCreate extends ICalendar {
  url: string
  type: number
}

export interface IEventCreate extends ICalendar {
  url: string
  csv: string[]
}

export enum CalendarURLType {
  UNKNOWN = -1,
  MAU
}

export enum CalendarFileType {
  UNKNOWN = -1,
  JSON,
  ICS
}

export enum ECalendarStatus {
  TENTATIVE,
  CONFIRMED,
  CANCELLED,
}
export type TCalendarStatus = keyof typeof ECalendarStatus

export enum EBusyStatus {
  BUSY,
  FREE,
  TENTATIVE,
}

export type TBusyStatus = keyof typeof EBusyStatus

export enum EInputOuput {
  utc,
  local,
}

export type TInputOuput = keyof typeof EInputOuput

export interface ICalendarEvent {
  start: [number, number, number, number, number]
  startInputType?: TInputOuput
  startOutputType?: TInputOuput
  end: [number, number, number, number, number]
  endInputType?: TInputOuput
  endOutputType?: TInputOuput

  title?: string
  description?: string
  location?: string

  url?: string
  geo?: { lat: number; lon: number }

  categories?: string[]
  status?: TCalendarStatus
  busyStatus?: TBusyStatus

  organizer?: { name: string; email: string }
  attendees?: { name: string; email: string; rsvp: boolean }[]
}
