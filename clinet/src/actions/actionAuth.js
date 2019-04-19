// @flow

import { Action } from '../models/modelAction'
import { actionAuth } from '../models/modelAuth'
import type { History } from 'history'
import type { Dispatch } from '../models/'
import type { DataAuth } from '../models/modelAuth'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import setAuthToken from '../helpers/token.helper'

// Register User
export const registerUser = (userData: DataAuth, history: History) => (
  dispatch: Dispatch
) => {
  axios
    .post('/auth/register', userData)
    .then(res => history.push('/signin')) // re-direct to login on successful register
    .catch(err => dispatch(setError(err)))
}

// Login - get user token
export const loginUser = (userData: DataAuth) => (dispatch: Dispatch) => {
  axios
    .post('/auth/login', userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data
      localStorage.setItem('jwtToken', token)
      // Set token to Auth header
      setAuthToken(token)
      // Decode token to get user data
      const decoded = jwt_decode(token)
      // Set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(err => dispatch(setError(err)))
}

// Log user out
export const logoutUser = () => (dispatch: Dispatch) => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}

export const setCurrentUser = (decoded: Object): Action<Object> => {
  return {
    type: actionAuth.SET_CURRENT_USER,
    payload: decoded
  }
}

export const setError = (err: Object): Action<Object> => {
  return {
    type: actionAuth.GET_ERRORS,
    payload: err.response.data
  }
}
