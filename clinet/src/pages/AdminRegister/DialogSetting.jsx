// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'
import { withStyles } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const styles = (theme: Object) => ({
  formControl: {
    margin: theme.spacing.unit,
    width: 160
  }
})

function NumberFormatCustom(props: any) {
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values: any) => {
        onChange({
          target: {
            value: values.value
          }
        })
      }}
      allowNegative={false}
      allowEmptyFormatting={false}
    />
  )
}

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  statusDialog: boolean,
  statusFunction: () => void,
  inputFunction: (value: string) => void,
  videoSizeScale: number,
  detectThreshold: number,
  detectSize: number
}

class DialogSetting extends React.Component<ProvidedProps & Props> {
  render() {
    return (
      <Dialog
        open={this.props.statusDialog}
        onClose={this.props.statusFunction}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'xl'}>
        <DialogTitle id="select-dialog-title">Recognize Settings</DialogTitle>
        <DialogContent>
          <TextField
            label="Video size scale"
            value={this.props.videoSizeScale}
            className={this.props.classes.formControl}
            margin="normal"
            onInput={this.props.inputFunction('videoSizeScale')}
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
          <TextField
            label="Detect threshold"
            value={this.props.detectThreshold}
            className={this.props.classes.formControl}
            margin="normal"
            onInput={this.props.inputFunction('detectThreshold')}
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
          <TextField
            label="Detect image size"
            value={this.props.detectSize}
            className={this.props.classes.formControl}
            margin="normal"
            onInput={this.props.inputFunction('detectSize')}
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.statusFunction} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

DialogSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  statusDialog: PropTypes.bool.isRequired,
  statusFunction: PropTypes.func.isRequired,
  inputFunction: PropTypes.func.isRequired,
  videoSizeScale: PropTypes.number.isRequired,
  detectThreshold: PropTypes.number.isRequired,
  detectSize: PropTypes.number.isRequired
}

export default withStyles(styles)(DialogSetting)
