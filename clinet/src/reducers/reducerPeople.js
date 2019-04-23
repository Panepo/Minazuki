// @flow
import createReducer from './createReducer'
import type { Action } from '../models/modelAction'
import { actionPeople } from '../models/modelPeople'
import type { StatePeople, PeopleData } from '../models/modelPeople'

const initialState: StatePeople = {
  peoples: [],
  errors: {}
}

export const reducerPeople = createReducer(initialState, {
  [actionPeople.PEOPLE_GETALL](
    state: StatePeople,
    action: Action<PeopleData[]>
  ) {
    return { ...state, peoples: action.payload }
  },
  [actionPeople.PEOPLE_GETERROR](state: StatePeople, action: Action<Object>) {
    return { ...state, errors: action.payload }
  }
})
