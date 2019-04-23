// import { Action } from '../models/modelAction'
import { actionPeople } from '../models/modelPeople'
import type { Dispatch } from '../models/'
import axios from 'axios'
import { setError } from './actionPeople'

export const faceGet = (user: string) => (dispatch: Dispatch) => {
  axios
    .get('face/getFace', user)
    .then(res => dispatch({ type: actionPeople.FACE_GET, payload: res.body }))
    .catch(err => setError(err))
}
