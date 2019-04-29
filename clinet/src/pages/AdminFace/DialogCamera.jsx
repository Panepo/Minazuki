// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import type { StateSetting } from '../../models/modelSetting'
import * as actionFace from '../../actions/actionFace'
import * as actionInfo from '../../actions/actionInfo'
import { Link } from 'react-router-dom'
import WebcamCrop from '../../componments/WebcamCrop'
import { extractData } from '../../helpers/face.helper'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

const imageCamera = require('../../images/camera.jpg')

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
  videoSetting: StateSetting,
  toggleDialog: (target: string, onoff: boolean, name: string) => () => null
}

type State = {
  isPlaying: boolean,
  isCaptured: boolean,
  imageBuff: ImageData | null
}

class DialogCamera extends React.Component<ProvidedProps & Props, State> {
  state = {
    isPlaying: false,
    isCaptured: false,
    imageBuff: null
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================
  handleWebcam = () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false
      })
    } else {
      this.setState({
        isPlaying: true,
        isCaptured: false,
        imageBuff: null
      })
    }
  }

  handleCapture = () => {
    const { videoSetting } = this.props
    const rect = {
      x: 0,
      y: 0,
      width: videoSetting.rect.width * 2,
      height: videoSetting.rect.height * 2
    }
    this.setState(
      {
        isPlaying: false,
        isCaptured: true,
        imageBuff: extractData('face_camera', rect)
      },
      () => this.postCapture()
    )
  }

  postCapture = () => {
    const canvas = document.getElementById('face_camera_screenshot')
    if (
      canvas instanceof HTMLCanvasElement &&
      this.state.imageBuff instanceof ImageData
    ) {
      const ctx = canvas.getContext('2d')
      // $flow-disable-line
      ctx.putImageData(this.state.imageBuff, 0, 0)
    }
  }

  handleExited = () => {
    this.setState({
      isPlaying: false,
      isCaptured: false,
      imageBuff: null
    })
  }

  handleAccept = () => {
    if (this.state.isCaptured) {
      const canvas = document.getElementById('face_camera_screenshot')
      if (canvas instanceof HTMLCanvasElement) {
        const content = canvas.toDataURL('image/jpeg')
        this.props.actionsF.faceAdd64({
          user: this.props.username,
          content
        })
        this.setState({
          isPlaying: true,
          isCaptured: false,
          imageBuff: null
        })
      }
    } else {
      this.props.actionsI.infoSet({
        onoff: true,
        variant: 'error',
        message: 'Start webcam and capture an image first.'
      })
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const renderWebcamPower = this.state.isPlaying ? (
      <Button color="secondary" onClick={this.handleWebcam}>
        Webcam Stop
      </Button>
    ) : (
      <Button color="primary" onClick={this.handleWebcam}>
        Webcam Start
      </Button>
    )

    return (
      <DialogActions>
        {renderWebcamPower}
        <Button color="primary" onClick={this.handleCapture}>
          Capture
        </Button>
        <Link to="/setting">
          <Button color="primary">Settings</Button>
        </Link>
        <Button onClick={this.handleAccept} color="primary">
          Accept
        </Button>
        <Button
          onClick={this.props.toggleDialog('camera', false, '')}
          color="secondary">
          Close
        </Button>
      </DialogActions>
    )
  }

  renderWebCam = () => {
    const { videoSetting } = this.props

    if (this.state.isPlaying) {
      return (
        <WebcamCrop
          className={this.props.classes.webcam}
          audio={false}
          idCanvas={'face_camera'}
          videoWidth={videoSetting.rect.width * 2}
          videoHeight={videoSetting.rect.height * 2}
          videoConstraints={videoSetting.video}
          cropx={videoSetting.rect.x}
          cropy={videoSetting.rect.y}
          cropwidth={videoSetting.rect.width}
          cropheight={videoSetting.rect.height}
        />
      )
    } else if (this.state.isCaptured) {
      return (
        <canvas
          className={this.props.classes.webcam}
          id={'face_camera_screenshot'}
          width={videoSetting.rect.width * 2}
          height={videoSetting.rect.height * 2}
        />
      )
    } else {
      return <img src={imageCamera} alt={'setting'} width={640} height={480} />
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.dialogStatus}
        onClose={this.props.toggleDialog('camera', false, '')}
        onExited={this.handleExited}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'xl'}>
        <DialogTitle id="select-dialog-title">Camera</DialogTitle>
        <DialogContent>{this.renderWebCam()}</DialogContent>
        {this.renderButton()}
      </Dialog>
    )
  }
}

DialogCamera.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogStatus: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  toggleDialog: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return { videoSetting: state.reducerSetting }
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
)(withStyles(styles)(DialogCamera))
