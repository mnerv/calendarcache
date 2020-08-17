enum ECalendarStatus {
  TENTATIVE,
  CONFIRMED,
  CANCELLED,
}
type CalendarStatusType = keyof typeof ECalendarStatus

enum EBusyStatus {
  BUSY,
  FREE,
  TENTATIVE,
}

type BusyStatusType = keyof typeof EBusyStatus

enum EInputOuput {
  utc,
  local,
}

type InputOuputType = keyof typeof EInputOuput

export default class CalendarEvent {
  start!: [number, number, number, number, number]
  startInputType?: InputOuputType
  startOutputType?: InputOuputType
  end!: [number, number, number, number, number]
  endInputType?: InputOuputType
  endOutputType?: InputOuputType

  title?: string
  description?: string
  location?: string

  url?: string
  geo?: { lat: number; lon: number }

  categories?: string[]
  status?: CalendarStatusType
  busyStatus?: BusyStatusType

  organizer?: { name: string; email: string }
  attendees?: { name: string; email: string; rsvp: boolean }[]
}
