// @flow

import { Action } from '../models/modelAction'
import { actionSetting } from '../models/modelSetting'
import type { CanvasRect, VideoConstraints } from '../models/modelMisc'

export function modifyVideo(input: VideoConstraints): Action<VideoConstraints> {
  return {
    type: actionSetting.SETTING_VIDEO,
    payload: input
  }
}

export function modifyRect(input: CanvasRect): Action<CanvasRect> {
  return {
    type: actionSetting.SETTING_RECT,
    payload: input
  }
}
