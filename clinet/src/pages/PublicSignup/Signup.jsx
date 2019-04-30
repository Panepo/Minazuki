// @flow

import * as React from 'react'
import Layout from '../Layout'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch, RouterHistory } from '../../models'
import type { StateAuth, DataAuth, DataAuthError } from '../../models/modelAuth'
import * as actionAuth from '../../actions/actionAuth'
import { Link, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const imageSignup = require('../../images/signup.jpg')

const styles = (theme: Object) => ({
  card: {
    minWidth: 275
  },
  formControl: {
    margin: theme.spacing.unit,
    width: 160
  }
})

type ProvidedProps = {
  classes: Object,
  history: RouterHistory
}

type Props = {
  auth: StateAuth,
  actionA: Dispatch
}

type State = {
  isSending: boolean,
  dataAuth: DataAuth,
  dataAuthError: DataAuthError
}

class Signup extends React.Component<ProvidedProps & Props, State> {
  state = {
    isSending: false,
    dataAuth: {
      name: '',
      email: '',
      password: '',
      password2: ''
    },
    dataAuthError: {
      name: { onoff: false, message: '' },
      email: { onoff: false, message: '' },
      password: { onoff: false, message: '' },
      password2: { onoff: false, message: '' }
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      if (this.props.auth.user.admin) {
        this.props.history.push('/list')
      } else {
        this.props.history.push('/sensor')
      }
    }
  }

  componentWillReceiveProps(nextProps: ProvidedProps & Props) {
    if (nextProps.auth.isAuthenticated) {
      if (nextProps.auth.user.admin) {
        this.props.history.push('/list')
      } else {
        this.props.history.push('/sensor')
      }
    }
    if (nextProps.auth.error) {
      this.setState({
        dataAuthError: {
          name: {
            onoff: nextProps.auth.error.name ? true : false,
            message: nextProps.auth.error.name
          },
          email: {
            onoff: nextProps.auth.error.email ? true : false,
            message: nextProps.auth.error.email
          },
          password: {
            onoff: nextProps.auth.error.password ? true : false,
            message: nextProps.auth.error.password
          },
          password2: {
            onoff: nextProps.auth.error.password2 ? true : false,
            message: nextProps.auth.error.password2
          }
        }
      })
    } else {
      this.setState({
        dataAuthError: {
          name: { onoff: false, message: '' },
          email: { onoff: false, message: '' },
          password: { onoff: false, message: '' },
          password2: { onoff: false, message: '' }
        }
      })
    }
  }

  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      dataAuth: {
        ...this.state.dataAuth,
        [(event.target: window.HTMLInputElement)
          .id]: (event.target: window.HTMLInputElement).value
      }
    })
  }

  handleSubmit = (event: SyntheticEvent<HTMLButtonElement>) => {
    if (!this.state.isSending) {
      event.preventDefault()
      this.setState(
        {
          isSending: false
        },
        () => {
          const newUser: DataAuth = this.state.dataAuth
          this.props.actionA.registerUser(newUser, this.props.history)
        }
      )
    }
  }

  render() {
    return (
      <Layout
        helmet={true}
        title={'Signup | Minazuki'}
        content={
          <Card className={this.props.classes.card}>
            <CardActionArea>
              <img src={imageSignup} alt={'signup'} />
            </CardActionArea>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Signup
              </Typography>
              <div>
                <TextField
                  id="name"
                  label="Username"
                  className={this.props.classes.formControl}
                  value={this.state.dataAuth.name}
                  error={this.state.dataAuthError.name.onoff}
                  helperText={this.state.dataAuthError.name.message}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <TextField
                  id="email"
                  label="Email"
                  className={this.props.classes.formControl}
                  value={this.state.dataAuth.email}
                  error={this.state.dataAuthError.email.onoff}
                  helperText={this.state.dataAuthError.email.message}
                  onChange={this.handleChange}
                  margin="normal"
                />
              </div>
              <div>
                <TextField
                  id="password"
                  label="Password"
                  className={this.props.classes.formControl}
                  value={this.state.dataAuth.password}
                  error={this.state.dataAuthError.password.onoff}
                  helperText={this.state.dataAuthError.password.message}
                  onChange={this.handleChange}
                  margin="normal"
                  type="password"
                />
                <TextField
                  id="password2"
                  label="Confirm Password"
                  className={this.props.classes.formControl}
                  value={this.state.dataAuth.password2}
                  error={this.state.dataAuthError.password2.onoff}
                  helperText={this.state.dataAuthError.password2.message}
                  onChange={this.handleChange}
                  margin="normal"
                  type="password"
                />
              </div>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={this.handleSubmit}>
                Signup
              </Button>
              <Link to="/home">
                <Button color="primary">Cancel</Button>
              </Link>
            </CardActions>
          </Card>
        }
      />
    )
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.reducerAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionA: bindActionCreators(actionAuth, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Signup)))
