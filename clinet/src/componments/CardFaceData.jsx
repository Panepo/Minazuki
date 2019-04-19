// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'

const styles = (theme: Object) => ({
  grid: {},
  textField: {}
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  className: string,
  faceData: {
    name: string,
    email: string,
    department: string
  }
}

class CardFaceData extends React.Component<ProvidedProps & Props> {
  render() {
    return (
      <Card>
        <CardContent>
          <Grid
            container={true}
            className={this.props.classes.grid}
            spacing={8}>
            <Grid item={true} xs={4}>
              Space for Photo
            </Grid>
            <Grid item={true} xs={8}>
              <List component="nav">
                <ListItem>
                  <TextField
                    label="Name"
                    className={this.props.classes.textField}
                    value={this.props.faceData.name}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    label="Email"
                    className={this.props.classes.textField}
                    value={this.props.faceData.email}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    label="Department"
                    className={this.props.classes.textField}
                    value={this.props.faceData.department}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions />
      </Card>
    )
  }
}

CardFaceData.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  faceData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired
  })
}

export default withStyles(styles)(CardFaceData)
