// @flow

import React from 'react'
import Layout from './Layout'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core'

const image404 = require('../images/404.jpg')

const styles = (theme: Object) => ({
  card: {
    minWidth: 275
  }
})

type Props = {
  classes: Object
}

const NotFound = (props: Props) => {
  return (
    <Layout
      helmet={true}
      title={'File Not Found | Minazuki'}
      content={
        <Card className={props.classes.card}>
          <CardActionArea>
            <img src={image404} alt={'404'} />
          </CardActionArea>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              File Not Found
            </Typography>
          </CardContent>
          <CardActions>
            <Link to="/home">
              <Button color="primary">Home</Button>
            </Link>
            <Link to="/signin">
              <Button color="primary">Signin</Button>
            </Link>
          </CardActions>
        </Card>
      }
    />
  )
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NotFound)
