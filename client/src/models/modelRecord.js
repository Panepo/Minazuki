// @flow

import type Action from './modelAction'

export const actionRecord = {
  RECORD_ADD: 'RECORD_ADD',
  RECORD_CLEAR: 'RECORD_CLEAR'
}

export type RecordData = {
  name: string,
  date: number
}

export type ActionRecord = Action<RecordData>

export type StateRecord = {
  data: RecordData[]
}
