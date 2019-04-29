import { Action } from '../models/modelAction'
import { actionData } from '../models/modelData'
import type { Dispatch } from '../models/'
import axios from 'axios'
import { infoSet } from './actionInfo'

export const dataLoad = () => (dispatch: Dispatch) => {
  axios
    .get('data/load')
    .then(res => {
      dispatch({ type: actionData.DATA_LOAD, payload: res.data })
    })
    .catch(err => dispatch(setError(err)))
}

export const dataSave = (input: object) => (dispatch: Dispatch) => {
  axios
    .post('data/save', input)
    .then(res =>
      dispatch(
        infoSet({ onoff: true, variant: 'info', message: 'File uploaded.' })
      )
    )
    .catch(err => dispatch(setError(err)))
}

export const dataImport = (input: object) => {
  return {
    type: actionData.DATA_IMPORT,
    payload: input
  }
}

export const setError = (err: Object): Action<Object> => (
  dispatch: Dispatch
) => {
  dispatch(
    infoSet({ onoff: true, variant: 'error', message: err.response.data })
  )
  return {
    type: actionData.PEOPLE_GETERROR,
    payload: err.response.data
  }
}
