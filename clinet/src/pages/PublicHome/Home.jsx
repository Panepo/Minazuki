// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import type { RouterHistory } from '../../models'
import type { StateAuth } from '../../models/modelAuth'
import type { StateRecord } from '../../models/modelRecord'
import { Link } from 'react-router-dom'
import { environment } from '../../environment'
import Layout from '../Layout'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconTrain from '@material-ui/icons/Polymer'
import IconSettings from '@material-ui/icons/Settings'
import IconRecord from '@material-ui/icons/RecordVoiceOver'
import IconSensor from '@material-ui/icons/Contacts'
import IconList from '@material-ui/icons/AssignmentInd'
import CardButton from '../../componments/CardButton'

const imageHome = require('../../images/home.jpg')

const styles = (theme: Object) => ({
  card: {
    minWidth: 275,
    marginBottom: theme.spacing.unit
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
  record: StateRecord
}

class Home extends React.Component<ProvidedProps & Props> {
  handleRedirect = (link: string) => () => {
    this.props.history.push('/' + link)
  }

  render() {
    const renderSignin = this.props.auth.isAuthenticated ? null : (
      <Link to="/signin">
        <Button color="primary">Signin</Button>
      </Link>
    )

    const renderSignup = this.props.auth.isAuthenticated ? null : (
      <Link to="/signup">
        <Button color="primary">Signup</Button>
      </Link>
    )

    const renderSensor = this.props.auth.isAuthenticated ? (
      <Link to="/sensor">
        <Button color="primary">Sensor</Button>
      </Link>
    ) : null

    const renderList = this.props.auth.user.admin ? (
      <Link to="/list">
        <Button color="primary">List</Button>
      </Link>
    ) : null

    const renderMenuSensor = (
      <CardButton
        clickFunction={this.handleRedirect('sensor')}
        avatar={<IconSensor color="primary" />}
        title={'Sensor'}
        subheader={'Start the sensor to detect and recognize face.'}
      />
    )

    const renderMenuSetting = (
      <CardButton
        clickFunction={this.handleRedirect('setting')}
        avatar={<IconSettings color="primary" />}
        title={'Setting'}
        subheader={'Configure your camera to fetch the best vision.'}
      />
    )

    const renderMenuRecord =
      this.props.record.data.length > 0 ? (
        <CardButton
          clickFunction={this.handleRedirect('record')}
          avatar={<IconRecord color="primary" />}
          title={'Record'}
          subheader={'Check the face recognition record.'}
        />
      ) : null

    const renderMenuTrain = this.props.auth.user.admin ? (
      <CardButton
        clickFunction={this.handleRedirect('train')}
        avatar={<IconTrain color="primary" />}
        title={'Train'}
        subheader={'Training to let neural network remember the face.'}
      />
    ) : null

    const renderMenuList = this.props.auth.user.admin ? (
      <CardButton
        clickFunction={this.handleRedirect('list')}
        avatar={<IconList color="primary" />}
        title={'List'}
        subheader={'Manage the faces on the server.'}
      />
    ) : null

    const renderMenu = this.props.auth.isAuthenticated ? (
      <Grid item={true} xs={4}>
        {renderMenuSensor}
        {renderMenuSetting}
        {renderMenuRecord}
        {renderMenuList}
        {renderMenuTrain}
      </Grid>
    ) : null

    return (
      <Layout
        helmet={true}
        title={'Home'}
        gridNormal={6}
        gridPhone={8}
        content={
          <Grid
            container={true}
            className={this.props.classes.grid}
            spacing={16}
            justify="center">
            <Grid item={true} xs={8}>
              <Card className={this.props.classes.card}>
                <CardActionArea>
                  <img src={imageHome} alt={'home'} width={640} height={480} />
                </CardActionArea>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {environment.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  {renderSignin}
                  {renderSignup}
                  {renderSensor}
                  {renderList}
                </CardActions>
              </Card>
            </Grid>
            {renderMenu}
          </Grid>
        }
      />
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.reducerAuth,
    record: state.reducerRecord
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Home))
