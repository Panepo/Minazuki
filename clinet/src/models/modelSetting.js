// @flow

export const actionSetting = {
  MODIFY_SETTING: 'MODIFY_SETTING',
  MODIFY_RECT: 'MODIFY_RECT'
}

export type PayloadSetting = {
  column: string,
  value: number
}

export type ActionSetting = { type: string, payload: PayloadSetting }

export type StateSetting = {
  x: number,
  y: number,
  width: number,
  height: number
}

export type StateSettingError = {
  x: { onoff: boolean, message: string },
  y: { onoff: boolean, message: string },
  width: { onoff: boolean, message: string },
  height: { onoff: boolean, message: string }
}
