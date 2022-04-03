export const urls = [
  'https://schema.mau.se/setup/jsp/Schema.jsp',  // Malmö University Kronox
]

export enum Name {
  unknown = -1,
  mau     =  0,
}

export enum CalendarFile {
  JSON = 0,
  ICS  = 1,
}

// TODO: Create URL class and use it to match the domain with supported list
export function isSupported(url: string): boolean {
  return urls.findIndex(u => url.startsWith(u)) !== -1
}

export function getName(url: string): Name {
  return urls.findIndex(u => url.startsWith(u))
}

export function getType(url: string): CalendarFile {
  return url.endsWith('.json') ? CalendarFile.JSON : CalendarFile.ICS
}

export function removeExtension(url: string): string {
  return url.replace(/\.json$/, '').replace(/\.ics$/, '')
}

export default {
  Name,
  getName,
  urls,
  isSupported,
  CalendarFile,
  getType,
  removeExtension,
}
