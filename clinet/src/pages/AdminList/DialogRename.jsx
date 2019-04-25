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
import TextField from '@material-ui/core/TextField'

const styles = (theme: Object) => ({})

type Props = {
  classes: Object,
  dialogStatus: boolean,
  username: string,
  rename: string,
  imageSrc: string,
  toggleDialog: (target: string, onoff: boolean, name: string) => () => null,
  handleAccept: (
    target: string
  ) => (event: SyntheticEvent<HTMLInputElement>) => null,
  handleInput: (
    target: string
  ) => (event: SyntheticEvent<HTMLInputElement>) => null
}

const DialogRename = (props: Props) => {
  return (
    <Dialog
      open={props.dialogStatus}
      onClose={props.toggleDialog('rename', false, '')}
      aria-labelledby="select-dialog-title"
      aria-describedby="select-dialog-description"
      maxWidth={'xl'}>
      <DialogTitle id="select-dialog-title">Rename</DialogTitle>
      <DialogContent>
        <div>
          <img src={props.imageSrc} alt={'rename'} width={300} />
        </div>
        <div>
          <Typography gutterBottom variant="h5" component="h2">
            {props.username}
          </Typography>
        </div>
        <div>
          <TextField
            autoFocus
            label="Enter Name"
            value={props.rename}
            margin="dense"
            fullWidth
            onInput={props.handleInput('rename')}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleAccept('rename')} color="primary">
          Accept
        </Button>
        <Button
          onClick={props.toggleDialog('rename', false, '')}
          color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DialogRename.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogStatus: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleInput: PropTypes.func.isRequired,
  imageSrc: PropTypes.string.isRequired,
  rename: PropTypes.string.isRequired
}

export default withStyles(styles)(DialogRename)
