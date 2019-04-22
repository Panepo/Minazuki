// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'
import type { BrowserHistory, HashHistory, MemoryHistory } from 'history'

import type { StateAuth, ActionAuth } from './modelAuth'
import type { StateSetting, ActionSetting } from './modelSetting'
import type { ActionInfo, StateInfo } from './modelInfo'

export type RouterHistory = BrowserHistory | HashHistory | MemoryHistory

export type ReduxInitAction = { type: '@@INIT' }

export type State = StateAuth & StateSetting & StateInfo

export type Action = ReduxInitAction | ActionAuth | ActionSetting | ActionInfo

export type Store = ReduxStore<State, Action>

export type Dispatch = ReduxDispatch<Action>
