import { Action } from '../models/modelAction'
import { actionPeople } from '../models/modelPeople'
import type { Dispatch } from '../models/'
import axios from 'axios'
import { infoSet } from './actionInfo'

export const peopleGet = (user: string) => (dispatch: Dispatch) => {
  axios
    .get('face/getPeople')
    .then(res => dispatch({ type: actionPeople.PEOPLE_GET, payload: res.data }))
    .catch(err => dispatch(setError(err)))
}

export const peopleGetAll = () => (dispatch: Dispatch) => {
  axios
    .get('face/getAll')
    .then(res => {
      dispatch({ type: actionPeople.PEOPLE_GETALL, payload: res.data })
    })
    .catch(err => dispatch(setError(err)))
}

export const peopleAdd = (input: { name: string }) => (dispatch: Dispatch) => {
  axios
    .post('face/addPeople', input)
    .then(res => dispatch(peopleGetAll()))
    .catch(err => dispatch(setError(err)))
}

export const peopleRename = (input: { name: string, newName: string }) => (
  dispatch: Dispatch
) => {
  axios
    .post('face/renamePeople', input)
    .then(res => dispatch(peopleGetAll()))
    .catch(err => dispatch(setError(err)))
}

export const peopleDelete = (input: { name: string }) => (
  dispatch: Dispatch
) => {
  axios
    .post('face/deletePeople', input)
    .then(res => dispatch(peopleGetAll()))
    .catch(err => dispatch(setError(err)))
}

export const setError = (err: Object): Action<Object> => (
  dispatch: Dispatch
) => {
  dispatch(
    infoSet({ onoff: true, variant: 'error', message: err.response.data })
  )
  return {
    type: actionPeople.PEOPLE_GETERROR,
    payload: err.response.data
  }
}
