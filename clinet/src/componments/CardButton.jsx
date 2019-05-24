// @flow

import * as React from 'react'
import type { Node } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'

const styles = (theme: Object) => ({
  card: {
    minWidth: 275,
    marginBottom: theme.spacing.unit
  }
})

type Props = {
  classes: Object,
  className: string,
  clickFunction: (link: string) => {},
  title: string,
  subheader: string,
  avatar: Node
}

const CardButton = (props: Props) => {
  return (
    <Card className={classNames(props.classes.card, props.className)}>
      <CardActionArea onClick={props.clickFunction}>
        <CardHeader
          avatar={props.avatar}
          title={
            <Typography gutterBottom variant="h5" component="h2">
              {props.title}
            </Typography>
          }
          subheader={props.subheader}
        />
      </CardActionArea>
    </Card>
  )
}

CardButton.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  avatar: PropTypes.node,
  clickFunction: PropTypes.func,
  title: PropTypes.string,
  subheader: PropTypes.string
}

export default withStyles(styles)(CardButton)
