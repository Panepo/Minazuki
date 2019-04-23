// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionFace } from '../models/modelFace'
import type { PeopleData } from '../models/modelPeople'
import type { StateFace } from '../models/modelFace'

const initialState: StateFace = {
  people: {
    name: '',
    files: []
  },
  errors: {}
}

export const reducerFace = createReducer(initialState, {
  [actionFace.FACE_GETALL](state: StateFace, action: Action<PeopleData>) {
    return { ...state, people: action.payload }
  },
  [actionFace.FACE_GETERROR](state: StateFace, action: Action<Object>) {
    return { ...state, errors: action.payload }
  }
})
