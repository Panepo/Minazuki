import { combineReducers } from 'redux'
import type { History } from 'history'
import { connectRouter } from 'connected-react-router'
import * as reducerAuth from './reducerAuth'
import * as reducerSetting from './reducerSetting'
import * as reducerInfo from './reducerInfo'
import * as reducerPeople from './reducerPeople'

const rootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    ...reducerAuth,
    ...reducerSetting,
    ...reducerInfo,
    ...reducerPeople
  })

export default rootReducer
