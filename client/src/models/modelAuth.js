// @flow

import type Action from './modelAction'

export const actionAuth = {
  GET_ERRORS: 'AUTH_GET_ERRORS',
  SET_CURRENT_USER: 'AUTH_SET_CURRENT_USER'
}

export type ActionAuth = Action<Object>

export type StateAuth = {
  isAuthenticated: boolean,
  user: Object,
  error: Object
}

export type DataAuth = {
  name: string,
  email: string,
  password: string,
  password2: string
}

export type DataAuthError = {
  name: { onoff: boolean, message: string },
  email: { onoff: boolean, message: string },
  password: { onoff: boolean, message: string },
  password2: { onoff: boolean, message: string }
}
