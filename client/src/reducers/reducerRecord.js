// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionRecord } from '../models/modelRecord'
import type { StateRecord, RecordData } from '../models/modelRecord'
import { validateRepeat } from '../helpers/record.helper'
import { dbData, dbPeople } from '../database'

const initialState: StateRecord = {
  data: []
}

export const reducerRecord = createReducer(initialState, {
  [actionRecord.RECORD_ADD](state: StateRecord, action: Action<RecordData>) {
    if (validateRepeat(action.payload)) {
      const query = dbPeople.findOne({ name: action.payload.name })
      const data = {
        name: action.payload.name,
        date: action.payload.date,
        photo: query.files[0]
      }

      dbData.insert(data)
      const dbAll = dbData
        .chain()
        .simplesort('date')
        .data()
      return { ...state, data: dbAll }
    } else {
      return state
    }
  },
  [actionRecord.RECORD_CLEAR](state: StateRecord, action: Action<null>) {
    return { ...state, data: [] }
  }
})
