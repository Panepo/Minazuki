// @flow

import type Action from './modelAction'

export const actionData = {
  DATA_LOAD: 'DATA_LOAD',
  DATA_IMPORT: 'DATA_IMPORT',
  DATA_GETERROR: 'DATA_GETERROR',
  DATA_CLEAR: 'DATA_CLEAR'
}

export type ActionData = Action<Object>

export type StateData = {
  data: any[],
  errors: Object
}
