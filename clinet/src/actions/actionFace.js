import { Action } from '../models/modelAction'
import { actionFace } from '../models/modelFace'
import type { Dispatch } from '../models/'
import axios from 'axios'
import { infoSet } from './actionInfo'

export const faceGetAll = (user: string) => (dispatch: Dispatch) => {
  axios
    .get('../face/getFace', { params: { user: user } })
    .then(res => dispatch({ type: actionFace.FACE_GETALL, payload: res.data }))
    .catch(err => dispatch(setError(err)))
}

export const faceDelete = (input: { user: string, filename: string }) => (
  dispatch: Dispatch
) => {
  axios
    .post('../face/deleteFace', input)
    .then(res => dispatch(faceGetAll(input.user)))
    .catch(err => dispatch(setError(err)))
}

export const faceAdd = (input: FormData) => (dispatch: Dispatch) => {
  axios
    .post('../face/addFace', input)
    .then(res => dispatch(faceGetAll(input.get('user'))))
    .catch(err => dispatch(setError(err)))
}

export const faceAdd64 = (input: any) => (dispatch: Dispatch) => {
  axios
    .post('../face/addFace64', input)
    .then(res => dispatch(faceGetAll(input.user)))
    .catch(err => dispatch(setError(err)))
}

export const setError = (err: Object): Action<Object> => (
  dispatch: Dispatch
) => {
  dispatch(
    infoSet({ onoff: true, variant: 'error', message: 'An error occured' })
  )
  return {
    type: actionFace.FACE_GETERROR,
    payload: err.response.data
  }
}
