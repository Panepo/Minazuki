import { Action } from '../models/modelAction'
import { actionRecord } from '../models/modelRecord'
// import type { Dispatch } from '../models/'
import type { RecordData } from '../models/modelRecord'
// import { infoSet } from './actionInfo'

export const reportAdd = (input: RecordData): Action<RecordData> => {
  return {
    type: actionRecord.RECORD_ADD,
    payload: input
  }
}
