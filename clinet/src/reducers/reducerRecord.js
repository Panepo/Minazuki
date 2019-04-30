// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionRecord } from '../models/modelRecord'
import type { StateRecord, RecordData } from '../models/modelRecord'
import { validateRepeat } from '../helpers/record.helper'
import * as Lokijs from 'lokijs'

const db = new Lokijs('db')
export const dbData: Collection<RecordData> = db.addCollection('data')

const initialState: StateRecord = {
  data: []
}

export const reducerRecord = createReducer(initialState, {
  [actionRecord.RECORD_ADD](state: StateRecord, action: Action<RecordData>) {
    if (validateRepeat(action.payload)) {
      dbData.insert(action.payload)
      const dbAll = dbData.chain().simplesort("date").data()
      return { ...state, data: dbAll }
    } else {
      return state
    }
  }
})
