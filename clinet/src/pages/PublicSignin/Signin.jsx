// @flow

import * as React from 'react'
import Layout from '../Layout'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch, RouterHistory } from '../../models'
import type { StateAuth, DataAuth } from '../../models/modelAuth'
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

const imageSignin = require('../../images/signin.jpg')

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
  email: string,
  password: string,
  errors: Object,
  errorMessage: Object
}

class Signin extends React.Component<ProvidedProps & Props, State> {
  state = {
    isSending: false,
    email: '',
    password: '',
    errors: {
      email: false,
      password: false
    },
    errorMessage: {}
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
        errorMessage: nextProps.auth.error,
        errors: {
          email: nextProps.auth.error.email ? true : false,
          password: nextProps.auth.error.password ? true : false
        }
      })
    } else {
      this.setState({
        errorMessage: '',
        errors: {
          email: false,
          password: false
        }
      })
    }
  }

  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      [(event.target: window.HTMLInputElement)
        .id]: (event.target: window.HTMLInputElement).value
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
          const userData: DataAuth = {
            name: '',
            email: this.state.email,
            password: this.state.password,
            password2: ''
          }
          this.props.actionA.loginUser(userData)
        }
      )
    }
  }

  render() {
    return (
      <Layout
        helmet={true}
        title={'Signin | Minazuki'}
        content={
          <Card className={this.props.classes.card}>
            <CardActionArea>
              <img src={imageSignin} alt={'signin'} />
            </CardActionArea>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Signin
              </Typography>
              <TextField
                id="email"
                label="Email"
                error={this.state.errors.email}
                className={this.props.classes.formControl}
                value={this.state.email}
                onChange={this.handleChange}
                margin="normal"
                helperText={this.state.errorMessage.email}
              />
              <TextField
                id="password"
                label="Password"
                error={this.state.errors.password}
                className={this.props.classes.formControl}
                value={this.state.password}
                onChange={this.handleChange}
                margin="normal"
                type="password"
                helperText={this.state.errorMessage.password}
              />
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={this.handleSubmit}>
                Signin
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

Signin.propTypes = {
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
)(withStyles(styles)(withRouter(Signin)))
