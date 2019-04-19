// @flow

import React from 'react'
import type { Node } from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles, withWidth } from '@material-ui/core'
import { isSmartphone } from '../helpers/responsive.helper'

const styles = (theme: Object) => ({
  root: {
    flexGrow: 1,
    width: '100%'
  }
})

type Props = {
  classes: Object,
  width: string,
  helmet: boolean,
  title: string,
  content: Node,
  gridNormal: number,
  gridPhone: number
}

const Layout = (props: Props) => {
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
      <title>{props.title}</title>
    </Helmet>
  )

  return (
    <main className={props.classes.root}>
      {props.helmet ? renderHelmet : null}
      <Grid container={true} className={props.classes.grid} justify="center">
        <Grid
          item={true}
          xs={isSmartphone(props.width) ? props.gridPhone : props.gridNormal}>
          {props.content}
        </Grid>
      </Grid>
    </main>
  )
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  helmet: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  gridNormal: PropTypes.number.isRequired,
  gridPhone: PropTypes.number.isRequired
}

Layout.defaultProps = {
  helmet: false,
  title: 'title',
  gridNormal: 4,
  gridPhone: 8
}

export default withWidth()(withStyles(styles)(Layout))
