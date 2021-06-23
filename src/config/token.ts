import jwt from 'jsonwebtoken'
import { UniqueID } from 'nodejs-snowflake'

import { MACHINE_ID } from './env'

export const snow = new UniqueID({
  returnNumber: true,
  machineID: MACHINE_ID
})
