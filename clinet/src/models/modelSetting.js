// @flow

import type Action from './modelAction'
import type { CanvasRect, VideoConstraints } from './modelMisc'

export const actionSetting = {
  MODIFY_VIDEO: 'MODIFY_VIDEO',
  MODIFY_RECT: 'MODIFY_RECT'
}

export type ActionSetting = Action<Object>

export type StateSetting = {
  rect: CanvasRect,
  video: VideoConstraints
}
