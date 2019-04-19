import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App'
import Typography from '@material-ui/core/Typography'
import { persistor, store } from './configureStore'
import jwt_decode from 'jwt-decode'
import setAuthToken from './helpers/token.helper'
import * as actionAuth from './actions/actionAuth'

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken
  setAuthToken(token)
  // Decode token and get user info and exp
  const decoded = jwt_decode(token)
  // Set user and isAuthenticated
  store.dispatch(actionAuth.setCurrentUser(decoded))

  // Check for expired token
  const currentTime = Date.now() / 1000 // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(actionAuth.logoutUser())

    // Redirect to login
    window.location.href = './signin'
  }
}

const ReduxRoot = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<Typography>Loading...</Typography>}
        persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  )
}

export default ReduxRoot
