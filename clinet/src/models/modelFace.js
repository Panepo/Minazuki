// @flow

import type Action from './modelAction'
import type { PeopleData } from './modelPeople'

export const actionFace = {
  FACE_GETALL: 'FACE_GETALL',
  FACE_GETERROR: 'FACE_GETERROR'
}

export type ActionFace = Action<Object>

export type StateFace = {
  people: PeopleData,
  errors: Object
}
