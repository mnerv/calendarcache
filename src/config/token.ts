import fs from 'fs'
import path from 'path'

import jwt, { JwtPayload } from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { UniqueID } from 'nodejs-snowflake'

import {
  MACHINE_ID,
  DATA_PATH,
  ADMIN_SECRET,
  ADMIN_ROLE,
  ADMIN_TOKEN
} from './env'

export const snow = new UniqueID({
  returnNumber: true,
  machineID: MACHINE_ID
})

async function generateAdminSecret(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const secret = nanoid(36)
    fs.writeFile(path.join(DATA_PATH, ADMIN_SECRET),
      secret,
      { encoding: 'utf-8' },
      (err) => {
        if (err) reject(err)
        else resolve(secret)
      })
  })
}

async function getAdminSecret(): Promise<string> {
  if (!fs.existsSync(path.join(DATA_PATH, ADMIN_SECRET)))
    return await generateAdminSecret()
  else
    return new Promise<string>((resolve, reject) => {
      fs.readFile(path.join(DATA_PATH, ADMIN_SECRET),
        { encoding: 'utf-8' },
        (err, buffer) => {
          if (err) reject(err)
          else resolve(buffer.toString())
        })
    })
}

export async function generateAdminToken(): Promise<void> {
  try {
    const secret = await generateAdminSecret()
    const token = jwt.sign({ role: ADMIN_ROLE }, secret)
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(path.join(DATA_PATH, ADMIN_TOKEN), token,
        { encoding: 'utf-8' },
        err => {
          if (err) reject(err)
          else resolve()
        })
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function verifyJWTToken(
  token: string
): Promise<string> {
  try {
    const res = jwt.verify(token, await getAdminSecret()) as JwtPayload
    return Promise.resolve(res.role)
  } catch (err) {
    return Promise.reject(err)
  }
}
