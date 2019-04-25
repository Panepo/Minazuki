// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = (theme: Object) => ({})

type Props = {
  classes: Object,
  dialogStatus: boolean,
  username: string,
  imageSrc: string,
  toggleDialog: (target: string, onoff: boolean, name: string) => () => null,
  handleAccept: (
    target: string
  ) => (event: SyntheticEvent<HTMLInputElement>) => null
}

const DialogDelete = (props: Props) => {
  return (
    <Dialog
      open={props.dialogStatus}
      onClose={props.toggleDialog('delete', false, '')}
      aria-labelledby="select-dialog-title"
      aria-describedby="select-dialog-description"
      maxWidth={'xl'}>
      <DialogTitle id="select-dialog-title">Delete</DialogTitle>
      <DialogContent>
        <div>
          <img src={props.imageSrc} alt={'delete'} width={300} />
        </div>
        <Typography gutterBottom variant="h5" component="h2">
          {props.username}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleAccept('delete')} color="primary">
          Accept
        </Button>
        <Button
          onClick={props.toggleDialog('delete', false, '')}
          color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DialogDelete.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogStatus: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  handleAccept: PropTypes.func.isRequired
}

export default withStyles(styles)(DialogDelete)
