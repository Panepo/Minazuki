// @flow

import { Action } from '../models/modelAction'
import { actionSetting } from '../models/modelSetting'
import type { PayloadSetting, StateSetting } from '../models/modelSetting'

export function modifySetting(input: PayloadSetting): Action<PayloadSetting> {
  return {
    type: actionSetting.MODIFY_SETTING,
    payload: input
  }
}

export function modifyRect(input: StateSetting): Action<StateSetting> {
  return {
    type: actionSetting.MODIFY_RECT,
    payload: input
  }
}
