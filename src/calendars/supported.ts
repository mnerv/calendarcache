export const urls = [
  'https://schema.mau.se/setup/jsp/Schema.jsp',  // Malmö University Kronox
]

export enum name {
  unknown = -1,
  mau     =  0,
}

// TODO: Create URL class and use it to match the domain with supported list
export function isSupported(url: string): boolean {
  return urls.findIndex(u => url.startsWith(u)) !== -1
}

export function getName(url: string): name {
  return urls.findIndex(u => url.startsWith(u))
}

export default {
  name,
  getName,
  urls,
  isSupported,
}
