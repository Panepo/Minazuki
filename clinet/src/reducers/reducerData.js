// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionData } from '../models/modelData'
import type { StateData } from '../models/modelData'

const initialState: StateData = {
  data: {},
  errors: {}
}

export const reducerData = createReducer(initialState, {
  [actionData.DATA_GET](state: StateData, action: Action<Object>) {
    return { ...state, data: action.payload }
  },
  [actionData.DATA_GETERROR](state: StateData, action: Action<Object>) {
    return { ...state, errors: action.payload }
  }
})
