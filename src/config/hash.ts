import crypto from 'crypto'

export async function hash(value: string): Promise<ArrayBuffer> {
  return crypto.createHash('SHA256').update(value).digest()
}

export function hashToString(hash: ArrayBuffer): string {
  return Array.from(new Uint8Array(hash))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')
}

export default {
  hash,
  toString: hashToString,
}
