// @flow

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const AdminRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isAuthenticated) {
        if (auth.user.admin) {
          return <Component {...props} />
        } else {
          return <Redirect to="/sensor" />
        }
      } else {
        return <Redirect to="/signin" />
      }
    }}
  />
)

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.reducerAuth
  }
}

export default connect(mapStateToProps)(AdminRoute)
