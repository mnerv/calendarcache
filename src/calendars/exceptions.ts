export class CalendarException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CalendarException'
  }
}

export class CalendarSupportException extends CalendarException {
  constructor(message: string) {
    super(message)
    this.name = 'CalendarSupportException'
  }
}

export class CalendarParseException extends CalendarException {
  constructor(message: string) {
    super(message)
    this.name = 'CalendarParseException'
  }
}
