// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionData } from '../models/modelData'
import type { StateData } from '../models/modelData'

const initialState: StateData = {
  data: [],
  errors: {}
}

export const reducerData = createReducer(initialState, {
  [actionData.DATA_LOAD](state: StateData, action: Action<Object>) {
    return { ...state, data: action.payload }
  },
  [actionData.DATA_IMPORT](state: StateData, action: Action<Object>) {
    return { ...state, data: action.payload }
  },
  [actionData.DATA_GETERROR](state: StateData, action: Action<Object>) {
    return { ...state, errors: action.payload }
  },
  [actionData.DATA_CLEAR](state: StateData, action: Action<null>) {
    return { ...state, data: [] }
  }
})
