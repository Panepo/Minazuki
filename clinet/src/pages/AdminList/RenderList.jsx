// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import IconContent from '@material-ui/icons/Person'
import IconDelete from '@material-ui/icons/Delete'
import IconRename from '@material-ui/icons/Description'
import IconAdd from '@material-ui/icons/PersonAdd'
import IconCancel from '@material-ui/icons/Cancel'
import Typography from '@material-ui/core/Typography'
import type { PeopleData } from '../../models/modelPeople'

const imageList = require('../../images/list.jpg')
const imageList2 = require('../../images/list2.jpg')

const styles = (theme: Object) => ({
  media: {
    height: 140
  }
})

type Props = {
  classes: Object,
  handleAccept: (
    target: string
  ) => (event: SyntheticEvent<HTMLInputElement>) => null,
  handleInput: (
    target: string
  ) => (event: SyntheticEvent<HTMLInputElement>) => null,
  handleInputCancel: (target: string) => () => null,
  handleEdit: (name: string) => () => null,
  toggleDialog: (target: string, onoff: boolean, name: string) => () => null,
  peoples: PeopleData[],
  newValue: string
}

const RenderList = (props: Props) => {
  return (
    <Grid container={true} className={props.classes.grid} spacing={16}>
      {props.peoples.map(data => (
        <Grid item={true} xs={2} key={data.name}>
          <Card className={props.classes.card}>
            <CardMedia
              className={props.classes.media}
              image={data.files[0] ? data.files[0] : imageList}
              title={data.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {data.name}
              </Typography>
              <Typography component="p">
                Lizards are a widespread group of squamate reptiles, with over
                6,000 species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            <CardActions>
              <Tooltip title="Content">
                <IconButton
                  color="primary"
                  onClick={props.handleEdit(data.name)}>
                  <IconContent />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rename">
                <IconButton
                  color="primary"
                  onClick={props.toggleDialog('rename', true, data.name)}>
                  <IconRename />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="primary"
                  onClick={props.toggleDialog('delete', true, data.name)}>
                  <IconDelete />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Grid item={true} xs={2} key={'addfaceCard'}>
        <Card className={props.classes.card}>
          <img src={imageList2} alt={'add face'} height={140} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Add
            </Typography>
            <TextField
              label={'Enter name'}
              className={props.classes.formControl}
              value={props.newValue}
              onInput={props.handleInput('new')}
              margin="normal"
            />
          </CardContent>
          <CardActions>
            <Tooltip title="Add">
              <IconButton color="primary" onClick={props.handleAccept('new')}>
                <IconAdd />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                color="primary"
                onClick={props.handleInputCancel('new')}>
                <IconCancel />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

RenderList.propTypes = {
  classes: PropTypes.object.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleInput: PropTypes.func.isRequired,
  handleInputCancel: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  newValue: PropTypes.string.isRequired
}

export default withStyles(styles)(RenderList)
