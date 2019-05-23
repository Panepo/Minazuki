// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import { connect } from 'react-redux'
import type { StateAuth } from '../../models/modelAuth'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Button from '@material-ui/core/Button'

const imageHome = require('../../images/home.jpg')

const styles = (theme: Object) => ({
  card: {
    minWidth: 275
  },
  formControl: {
    margin: theme.spacing.unit,
    width: 160
  }
})

type Props = {
  auth: StateAuth,
  classes: Object
}

const Home = (props: Props) => {
  const renderSignin = props.auth.isAuthenticated ? null : (
    <Link to="/signin">
      <Button color="primary">Signin</Button>
    </Link>
  )

  const renderSignup = props.auth.isAuthenticated ? null : (
    <Link to="/signup">
      <Button color="primary">Signup</Button>
    </Link>
  )

  const renderSensor = props.auth.isAuthenticated ? (
    <Link to="/sensor">
      <Button color="primary">Sensor</Button>
    </Link>
  ) : null

  const renderList = props.auth.isAuthenticated ? (
    <Link to="/list">
      <Button color="primary">List</Button>
    </Link>
  ) : null

  return (
    <Layout
      helmet={true}
      title={'Home'}
      content={
        <Card className={props.classes.card}>
          <CardActionArea>
            <img src={imageHome} alt={'home'} />
          </CardActionArea>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Minazuki
            </Typography>
          </CardContent>
          <CardActions>
            {renderSignin}
            {renderSignup}
            {renderSensor}
            {renderList}
          </CardActions>
        </Card>
      }
    />
  )
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.reducerAuth
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Home))
