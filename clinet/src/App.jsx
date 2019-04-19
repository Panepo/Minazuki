// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { history } from './configureStore'
import { ConnectedRouter } from 'connected-react-router'
import { withStyles } from '@material-ui/core'
import withRoot from './withRoot'

import Header from './pages/Header'
import Ribbon from './pages/Ribbon'
import Footer from './pages/Footer'
import NotFound from './pages/NotFound'

import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'

import Home from './pages/Home/Home'
import Signin from './pages/Signin/Signin'
import Signup from './pages/Signup/Signup'
import Sensor from './pages/PrivateSensor/Sensor'
import Setting from './pages/PrivateSetting/Setting'
import Register from './pages/AdminRegister/Register'
import List from './pages/AdminList/List'

const styles = (theme: Object) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
  },
  content: {
    marginTop: '-55vh',
    marginBottom: '60px',
    flex: 1
  }
})

const routes = () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route exact={true} path="/home" component={Home} />
      <Route exact={true} path="/signin" component={Signin} />
      <Route exact={true} path="/signup" component={Signup} />
      <PrivateRoute exact={true} path="/sensor" component={Sensor} />
      <PrivateRoute exact={true} path="/setting" component={Setting} />
      <AdminRoute exact={true} path="/register" component={Register} />
      <AdminRoute exact={true} path="/list" component={List} />
      <Route component={NotFound} />
    </Switch>
  )
}

type Props = {
  classes: Object
}

const App = (props: Props) => {
  return (
    <ConnectedRouter history={history}>
      <BrowserRouter>
        <div className={props.classes.root}>
          <Header />
          <Ribbon />
          <div className={props.classes.content}>{routes()}</div>
          <Footer />
        </div>
      </BrowserRouter>
    </ConnectedRouter>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(App))
