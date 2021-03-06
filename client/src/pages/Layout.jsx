// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import type { Dispatch } from '../models'
import * as actionInfo from '../actions/actionInfo'
import type { StateInfo } from '../models/modelInfo'
import type { Node } from 'react'
import Helmet from 'react-helmet'
import { environment } from '../environment'
import Grid from '@material-ui/core/Grid'
import { withStyles, withWidth } from '@material-ui/core'
import { isSmartphone } from '../helpers/responsive.helper'
import Snackbar from '@material-ui/core/Snackbar'
import InfoBar from '../componments/InfoBar'

const styles = (theme: Object) => ({
  root: {
    flexGrow: 1,
    width: '100%'
  }
})

type ProvidedProps = {
  classes: Object,
  width: string
}

type Props = {
  helmet: boolean,
  title: string,
  content: Node,
  gridNormal: number,
  gridPhone: number,
  info: StateInfo,
  infoClose: () => {}
}

class Layout extends React.Component<ProvidedProps & Props> {
  static defaultProps = {
    helmet: false,
    title: 'title',
    gridNormal: 4,
    gridPhone: 8
  }

  handleInfoClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.props.infoClose()
  }

  render() {
    const renderHelmet = (
      <Helmet>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="author" content="Panepo@github" />
        <link rel="manifest" href="./manifest.json" />
        <link rel="shortcut icon" href="./favicon.ico" />
        <title>{this.props.title + ' | ' + environment.title}</title>
      </Helmet>
    )

    return (
      <main className={this.props.classes.root}>
        {this.props.helmet ? renderHelmet : null}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.props.info.onoff}
          autoHideDuration={6000}
          onClose={this.handleInfoClose}>
          <InfoBar
            onClose={this.handleInfoClose}
            variant={this.props.info.variant}
            message={this.props.info.message}
          />
        </Snackbar>
        <Grid
          container={true}
          className={this.props.classes.grid}
          justify="center">
          <Grid
            item={true}
            xs={
              isSmartphone(this.props.width)
                ? this.props.gridPhone
                : this.props.gridNormal
            }>
            {this.props.content}
          </Grid>
        </Grid>
      </main>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  helmet: PropTypes.bool,
  title: PropTypes.string,
  gridNormal: PropTypes.number,
  gridPhone: PropTypes.number,
  info: PropTypes.shape({
    onoff: PropTypes.bool.isRequired,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info'])
      .isRequired,
    message: PropTypes.string.isRequired
  })
}

const mapStateToProps = state => {
  return {
    info: state.reducerInfo
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    infoClose: () => {
      dispatch(actionInfo.infoClose())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(withStyles(styles)(Layout)))
