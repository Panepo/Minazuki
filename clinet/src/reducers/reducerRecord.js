// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionRecord } from '../models/modelRecord'
import type { StateRecord, RecordData } from '../models/modelRecord'
import { validateRepeat } from '../helpers/record.helper'

const initialState: StateRecord = {
  data: []
}

export const reducerData = createReducer(initialState, {
  [actionRecord.RECORD_ADD](state: StateRecord, action: Action<RecordData>) {
    if (validateRepeat(action.payload, state.data)) {
      return { data: state.data.push(action.payload) }
    } else {
      return state
    }
  }
})
