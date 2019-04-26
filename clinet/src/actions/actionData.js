import { Action } from '../models/modelAction'
import { actionData } from '../models/modelData'
import type { Dispatch } from '../models/'
import axios from 'axios'
import { infoSet } from './actionInfo'

export const dataGet = () => (dispatch: Dispatch) => {
  axios
    .get('data/getAll')
    .then(res => {
      dispatch({ type: actionData.DATA_GET, payload: res.data })
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
