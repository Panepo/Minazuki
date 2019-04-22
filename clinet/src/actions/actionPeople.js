import { Action } from '../models/modelAction'
import { actionPeople } from '../models/modelPeople'
import type { Dispatch } from '../models/'
import axios from 'axios'

export const peopleGet = (user: string) => (dispatch: Dispatch) => {
  axios
    .get('face/getPeople')
    .then(res => dispatch({ type: actionPeople.PEOPLE_GET, payload: res.body }))
    .catch(err => setError(err))
}

export const peopleGetAll = () => (dispatch: Dispatch) => {
  axios
    .get('face/getAll')
    .then(res => {
      dispatch({ type: actionPeople.PEOPLE_GETALL, payload: res.data })
    })
    .catch(err => setError(err))
}

export const faceGet = (user: string) => (dispatch: Dispatch) => {
  axios
    .get('face/getFace', user)
    .then(res => dispatch({ type: actionPeople.FACE_GET, payload: res.body }))
    .catch(err => setError(err))
}

export const setError = (err: Object): Action<Object> => {
  return {
    type: actionPeople.PEOPLE_GETERROR,
    payload: err.response.data
  }
}
