// @flow

import type Action from './modelAction'

export const actionPeople = {
  PEOPLE_GETALL: 'PEOPLE_GETALL',
  PEOPLE_GET: 'PEOPLE_GET',
  PEOPLE_ADD: 'PEOPLE_ADD',
  PEOPLE_DELETE: 'PEOPLE_DELETE',
  PEOPLE_RENAME: 'PEOPLE_RENAME',
  PEOPLE_GETERROR: 'PEOPLE_GETERROR',
  FACE_GET: 'FACE_GET'
}

export type ActionPeople = Action<Object>

export type PeopleData = {
  name: string,
  files: string[]
}

export type StatePeople = {
  peoples: PeopleData[],
  errors: Object
}
