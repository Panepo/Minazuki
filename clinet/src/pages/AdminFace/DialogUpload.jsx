// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionFace from '../../actions/actionFace'
import * as actionInfo from '../../actions/actionInfo'
import { withStyles } from '@material-ui/core/styles'
import ImageGallery from '../../componments/ImageGallery'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

const styles = (theme: Object) => ({
  hidden: {
    display: 'none'
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  actionsI: Dispatch,
  actionsF: Dispatch,
  dialogStatus: boolean,
  username: string,
  toggleDialog: (target: string, onoff: boolean, name: string) => () => null
}

type State = {
  imageFile: string[],
  imageForm: FormData | null
}

class DialogUpload extends React.Component<ProvidedProps & Props, State> {
  state = {
    imageFile: [],
    imageForm: null
  }

  handleAccept = (event: SyntheticEvent<HTMLInputElement>) => {
    if (this.state.imageFile.length > 0) {
      event.preventDefault()
      this.props.actionsF.faceAdd(this.state.imageForm)
      this.setState({
        imageFile: [],
        imageForm: null
      })
    } else {
      this.props.actionsI.infoSet({
        onoff: true,
        variant: 'error',
        message: 'Please select an image'
      })
    }
  }

  handleUpload = (event: any) => {
    const data = []

    for (let i = 0; i < event.target.files.length; i += 1) {
      let dataTemp
      if (event.target.files[i] != null) {
        dataTemp = URL.createObjectURL(event.target.files[i])
        data.push(dataTemp)
      }
    }

    const formData = new FormData()
    formData.append('user', this.props.username)
    Array.from(Array(event.target.files.length).keys()).map(x =>
      formData.append(
        event.target.name,
        event.target.files[x],
        event.target.files[x].name
      )
    )

    if (data.length > 0) {
      this.setState({
        imageFile: data,
        imageForm: formData
      })
    } else {
      this.setState({
        imageFile: [],
        imageForm: null
      })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.dialogStatus}
        onClose={this.props.toggleDialog('upload', false, '')}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'md'}>
        <DialogTitle id="select-dialog-title">Upload</DialogTitle>
        <DialogContent>
          <ImageGallery
            imageSrc={this.state.imageFile}
            imageWidth={256}
            imageHeight={256}
            imageText={'upload files'}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" component="label">
            Select Image
            <input
              className={this.props.classes.hidden}
              type="file"
              name="fileUpload"
              accept="image/*"
              onChange={this.handleUpload}
              required
              multiple
            />
          </Button>
          <Button onClick={this.handleAccept} color="primary">
            Accept
          </Button>
          <Button
            onClick={this.props.toggleDialog('upload', false, '')}
            color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

DialogUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogStatus: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  toggleDialog: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    actionsF: bindActionCreators(actionFace, dispatch),
    actionsI: bindActionCreators(actionInfo, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DialogUpload))
