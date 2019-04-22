// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionInfo } from '../models/modelInfo'
import type { StateInfo } from '../models/modelInfo'

const initialState: StateInfo = {
  onoff: false,
  variant: 'info',
  message: ''
}

export const reducerInfo = createReducer(initialState, {
  [actionInfo.INFO_SET](state: StateInfo, action: Action<StateInfo>) {
    return action.payload
  },
  [actionInfo.INFO_CLOSE](state: StateInfo, action: Action<null>) {
    return { ...state, onoff: false }
  }
})
