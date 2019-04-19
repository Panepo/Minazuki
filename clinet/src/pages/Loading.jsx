// @flow

import React from 'react'
import PropTypes from 'prop-types'
import Layout from './Layout'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme: Object) => ({
  paper: {
    borderRadius: '2px',
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: '56px',
    paddingRight: '56px'
  }
})

type Props = {
  classes: Object
}

const Loading = (props: Props) => {
  return (
    <Layout
      content={
        <Paper className={props.classes.paper}>
          <Typography>Loading...</Typography>
          <LinearProgress />
        </Paper>
      }
    />
  )
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Loading)
