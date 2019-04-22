// @flow

import type Action from './modelAction'

export const actionData = {
  DATA_GET: 'DATA_GET',
  DATA_SEND: 'DATA_SEND',
  DATA_ERROR: 'DATA_ERROR'
}

export type ActionAuth = Action<Object>

export type StateAuth = {
  faceMatcher: any | null,
  faceData: any,
  error: Object
}
