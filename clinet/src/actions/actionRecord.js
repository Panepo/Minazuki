import { Action } from '../models/modelAction'
import { actionRecord } from '../models/modelRecord'
import type { RecordData } from '../models/modelRecord'

export const recordAdd = (input: RecordData): Action<RecordData> => {
  return {
    type: actionRecord.RECORD_ADD,
    payload: input
  }
}

export const recordClear = (): Action<null> => {
  return {
    type: actionRecord.RECORD_CLEAR,
    payload: null
  }
}
