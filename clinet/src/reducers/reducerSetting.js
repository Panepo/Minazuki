// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionSetting } from '../models/modelSetting'
import type { StateSetting, PayloadSetting } from '../models/modelSetting'

const initialState: StateSetting = {
  x: 10,
  y: 10,
  width: 100,
  height: 100
}

export const reducerSetting = createReducer(initialState, {
  [actionSetting.MODIFY_SETTING](
    state: StateSetting,
    action: Action<PayloadSetting>
  ) {
    return { ...state, [action.payload.column]: action.payload.value }
  },
  [actionSetting.MODIFY_RECT](
    state: StateSetting,
    action: Action<StateSetting>
  ) {
    return action.payload
  }
})
