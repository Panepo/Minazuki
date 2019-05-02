// @flow

import type { RecordData } from '../models/modelRecord'
import { dbData } from '../database'

export function validateRepeat(input: RecordData) {
  const date = Date.now()
  const data = dbData
    .chain()
    .find({
      $and: [
        { name: input.name },
        {
          date: { $gt: date - 60000 } // 1 min
        }
      ]
    })
    .data()

  if (data.length > 0) return false
  return true
}
