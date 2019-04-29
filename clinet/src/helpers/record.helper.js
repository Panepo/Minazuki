// @flow

import type { RecordData } from '../models/modelRecord'

export function validateRepeat(input: RecordData, data: RecordData[]) {
  const len = data.length
  if (len === 0) return true

  const currentTime = Date.now()
  const expireTime = 1800 // seconds
  if (currentTime - data[len - 1].date > expireTime) {
    return true
  }

  // still needed to check repeat people name
  return false
}
