// @flow

import type Action from './modelAction'

export const actionPeople = {
  PEOPLE_GETALL: 'PEOPLE_GETALL',
  PEOPLE_GETERROR: 'PEOPLE_GETERROR'
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
