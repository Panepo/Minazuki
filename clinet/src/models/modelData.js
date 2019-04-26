// @flow

import type Action from './modelAction'

export const actionData = {
  DATA_GET: 'DATA_GET',
  DATA_GETERROR: 'DATA_GETERROR'
}

export type ActionData = Action<Object>

export type StateData = {
  data: Object,
  errors: Object
}
