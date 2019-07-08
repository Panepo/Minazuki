// @flow

import { Action } from '../models/modelAction'
import { actionInfo } from '../models/modelInfo'
import type { StateInfo } from '../models/modelInfo'

export function infoSet(input: StateInfo): Action<StateInfo> {
  return {
    type: actionInfo.INFO_SET,
    payload: input
  }
}

export function infoClose(): Action<null> {
  return {
    type: actionInfo.INFO_CLOSE,
    payload: null
  }
}
