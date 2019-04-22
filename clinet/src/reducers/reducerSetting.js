// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionSetting } from '../models/modelSetting'
import type { StateSetting } from '../models/modelSetting'
import type { CanvasRect, VideoConstraints } from '../models/modelMisc'

const initialState: StateSetting = {
  rect: { x: 100, y: 100, width: 100, height: 100 },
  video: {
    width: 1280,
    height: 720
  }
}

export const reducerSetting = createReducer(initialState, {
  [actionSetting.MODIFY_VIDEO](
    state: StateSetting,
    action: Action<VideoConstraints>
  ) {
    return { ...state, video: action.payload }
  },
  [actionSetting.MODIFY_RECT](state: StateSetting, action: Action<CanvasRect>) {
    return { ...state, rect: action.payload }
  }
})
