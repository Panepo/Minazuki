// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionAuth } from '../models/modelAuth'
import type { StateAuth } from '../models/modelAuth'
import isEmpty from 'is-empty'

const initialState: StateAuth = {
  isAuthenticated: false,
  user: {},
  error: {}
}

export const reducerAuth = createReducer(initialState, {
  [actionAuth.SET_CURRENT_USER](state: StateAuth, action: Action<Object>) {
    return {
      ...state,
      isAuthenticated: !isEmpty(action.payload),
      user: action.payload
    }
  },
  [actionAuth.GET_ERRORS](state: StateAuth, action: Action<Object>) {
    return {
      ...state,
      error: action.payload
    }
  }
})
