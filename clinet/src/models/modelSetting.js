// @flow

import type Action from './modelAction'
import type { CanvasRect, VideoConstraints } from './modelMisc'

export const actionSetting = {
  SETTING_VIDEO: 'SETTING_VIDEO',
  SETTING_RECT: 'SETTING_RECT'
}

export type ActionSetting = Action<Object>

export type StateSetting = {
  rect: CanvasRect,
  video: VideoConstraints
}
