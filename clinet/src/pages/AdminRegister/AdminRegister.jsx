// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionRegister from '../../actions/actionRegister'
import type { StateSetting } from '../../models/modelSetting'
import type {
  StateRegister,
  FaceForm,
  FaceFormError
} from '../../models/modelRegister'
import * as faceapi from 'face-api.js'
import { resizeCanvasAndResults, extractData } from '../../helpers/face.helper'
import { validateFaceRegister } from '../../helpers/validate.helper'
import WebcamCrop from '../../componments/WebcamCrop'
import SnackbarContentWrapper from '../../componments/SnackContent'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import Snackbar from '@material-ui/core/Snackbar'
import DialogSetting from './DialogSetting'

const imageRegister = require('../../images/register.jpg')
const imageBlack = require('../../images/black.png')

const styles = (theme: Object) => ({
  paper: {
    borderRadius: '2px',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '40px',
    paddingRight: '40px'
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  hidden: {
    display: 'none'
  },
  webcamContainer: {
    position: 'relative'
  },
  webcam: {
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  webcamOverlay: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 10
  },
  margin: {
    margin: theme.spacing.unit
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  videoSetting: StateSetting,
  actionR: Dispatch,
  register: StateRegister
}

type State = {
  isLoading: boolean,
  isPlaying: boolean,
  isCaptured: boolean,
  isDetected: boolean,
  isBusy: boolean,
  isSending: boolean,
  imageBuff: ImageData | null,
  results: Object | null,
  videoBuff: any,
  videoConstraints: {
    width: number,
    height: number
  },
  videoSizeScale: number,
  detectThreshold: number,
  detectSize: number,
  tickPredict: number,
  statusDialog: boolean,
  snackStatus: boolean,
  snackType: string,
  registerForm: FaceForm,
  registerFormError: FaceFormError,
  snackMessage: string
}

class AdminRegister extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    isPlaying: false,
    isCaptured: false,
    isDetected: false,
    isBusy: false,
    isSending: false,
    imageBuff: null,
    results: null,
    videoBuff: null,
    videoConstraints: {
      width: 1280,
      height: 720
    },
    videoSizeScale: 2,
    detectThreshold: 50,
    detectSize: 160,
    tickPredict: 1000,
    statusDialog: false,
    snackStatus: false,
    snackType: '',
    registerForm: {
      photo: null,
      name: '',
      department: '',
      email: '',
      descriptor: null
    },
    registerFormError: {
      name: { onoff: false, message: '' },
      department: { onoff: false, message: '' },
      email: { onoff: false, message: '' }
    },
    snackMessage: ''
  }
  interval: number = 0

  componentDidMount = async () => {
    await faceapi.loadTinyFaceDetectorModel('/models')
    await faceapi.loadFaceLandmarkTinyModel('/models')
    await faceapi.loadFaceRecognitionModel('/models')
    const initial = document.getElementById('initial_black')
    await faceapi
      .detectSingleFace(
        initial,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: this.state.detectSize,
          scoreThreshold: this.state.detectThreshold / 100
        })
      )
      .withFaceLandmarks(true)
      .withFaceDescriptor()
    this.setState({ isLoading: false })
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  componentWillReceiveProps(nextProps: ProvidedProps & Props) {
    if (nextProps.register.error) {
      this.setState({
        isSending: false,
        snackStatus: true,
        snackType: 'error',
        snackMessage: 'An error occured',
        registerFormError: {
          name: {
            onoff: nextProps.register.error.name ? true : false,
            message: nextProps.register.error.name
          },
          department: {
            onoff: nextProps.register.error.department ? true : false,
            message: nextProps.register.error.department
          },
          email: {
            onoff: nextProps.register.error.email ? true : false,
            message: nextProps.register.error.email
          }
        }
      })
    } else {
      this.setState({
        registerFormError: {
          name: { onoff: false, message: '' },
          email: { onoff: false, message: '' },
          department: { onoff: false, message: '' }
        }
      })
    }

    if (
      nextProps.register.switchRegister !== this.props.register.switchRegister
    ) {
      this.setState({
        isSending: false,
        snackStatus: true,
        snackType: 'success',
        snackMessage: 'Face add.'
      })
    }
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================
  handleChange = (value: string) => (event: any) => {
    if (event.target.value.length > 0) {
      this.setState({ [value]: event.target.value })
    }
  }

  handleForm = (value: string) => (event: any) => {
    if (event.target.value.length > 0) {
      this.setState({
        registerForm: {
          ...this.state.registerForm,
          [value]: event.target.value
        }
      })
    }
  }

  handleDialogOpen = () => {
    this.setState({ statusDialog: true })
  }

  handleDialogClose = () => {
    this.setState({ statusDialog: false })
  }

  handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ snackStatus: false })
  }

  handleWebcam = () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
        isCaptured: false,
        isDetected: false
      })
    } else {
      this.setState({
        isPlaying: true,
        isCaptured: false,
        isDetected: false
      })
    }
  }

  handleCapture = () => {
    const rect = {
      x: 0,
      y: 0,
      width: this.props.videoSetting.width * this.state.videoSizeScale,
      height: this.props.videoSetting.height * this.state.videoSizeScale
    }
    this.setState(
      {
        isPlaying: false,
        isCaptured: true,
        isDetected: false,
        imageBuff: extractData('register_webcamcrop', rect)
      },
      () => this.processFaceRecognize()
    )
  }

  handleCancel = () => {
    this.setState({
      isPlaying: true,
      isCaptured: false,
      isDetected: false,
      imageBuff: null
    })
  }

  handleAccept = (event: SyntheticEvent<HTMLButtonElement>) => {
    const result = validateFaceRegister(this.state.registerForm)
    if (result.name.onoff || result.department.onoff || result.email.onoff) {
      this.setState({ registerFormError: result })
    } else {
      if (!this.state.isSending) {
        event.preventDefault()
        this.setState({ isSending: true }, () => {
          const newForm: FaceForm = this.state.registerForm
          this.props.actionR.registerFace(newForm)
        })
      } else {
        this.setState({
          snackStatus: true,
          snackType: 'warning',
          snackMessage: 'Busy sending data to server...'
        })
      }
    }
  }

  // ================================================================================
  // Facec recognition functions
  // ================================================================================
  processFaceRecognize = () => {
    const canvas = document.getElementById('register_screenshot')
    if (
      canvas instanceof HTMLCanvasElement &&
      this.state.imageBuff instanceof ImageData
    ) {
      const ctx = canvas.getContext('2d')
      // $flow-disable-line
      ctx.putImageData(this.state.imageBuff, 0, 0)
      this.setState({ isBusy: true }, () => this.processDetect())
    }
  }

  processDetect = async () => {
    const image = document.getElementById('register_screenshot')
    const canvas = document.getElementById('register_screenshot_overlay')
    if (
      image instanceof HTMLCanvasElement &&
      canvas instanceof HTMLCanvasElement
    ) {
      const results = await faceapi
        .detectSingleFace(
          image,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: this.state.detectSize,
            scoreThreshold: this.state.detectThreshold / 100
          })
        )
        .withFaceLandmarks(true)
        .withFaceDescriptor()
      if (results) {
        this.setState(
          {
            isDetected: true,
            isBusy: false,
            results: results,
            snackStatus: false,
            snackMessage: ''
          },
          () => this.processRender()
        )
      } else {
        this.setState({
          isDetected: false,
          isBusy: false,
          snackStatus: true,
          snackType: 'error',
          snackMessage: 'No people found.'
        })
      }
    }
  }

  processRender = () => {
    const image = document.getElementById('register_screenshot')
    const canvas = document.getElementById('register_screenshot_overlay')
    if (
      image instanceof HTMLCanvasElement &&
      canvas instanceof HTMLCanvasElement
    ) {
      const ctx = image.getContext('2d')
      // $flow-disable-line
      ctx.putImageData(this.state.imageBuff, 0, 0)
      const resizedResults = resizeCanvasAndResults(
        image,
        canvas,
        this.state.results
      )
      const boxesWithText = new faceapi.BoxWithText(
        resizedResults.detection.box,
        resizedResults.detection.score.toString()
      )
      faceapi.drawDetection(canvas, boxesWithText, { boxColor: 'lime' })
      const rect = resizedResults.detection.box
      const imageData = extractData('register_screenshot', rect)

      let canvas2 = document.createElement('canvas')
      canvas2.width = rect.width
      canvas2.height = rect.height
      const ctx2 = canvas2.getContext('2d')
      // $flow-disable-line
      ctx2.putImageData(imageData, 0, 0)

      let canvas3 = document.createElement('canvas')
      canvas3.width = 128
      canvas3.height = 128
      const ctx3 = canvas3.getContext('2d')
      ctx3.drawImage(
        canvas2,
        0,
        0,
        rect.width > rect.height ? rect.width : rect.height,
        rect.width > rect.height ? rect.width : rect.height,
        0,
        0,
        128,
        128
      )
      const URL = canvas3.toDataURL('image/png')
      canvas2.remove()
      canvas3.remove()
      this.setState({
        registerForm: {
          ...this.state.registerForm,
          // $flow-disable-line
          descriptor: this.state.results.descriptor,
          photo: URL
        }
      })
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const renderWebcamPower = (onoff: boolean) => {
      if (onoff) {
        return (
          <Button color="secondary" onClick={this.handleWebcam}>
            Webcam Stop
          </Button>
        )
      } else {
        return (
          <Button color="primary" onClick={this.handleWebcam}>
            Webcam Start
          </Button>
        )
      }
    }

    const renderWebcamCapture = (onoff: boolean) => {
      if (onoff) {
        return (
          <Button color="primary" onClick={this.handleCapture}>
            Take Screenshot
          </Button>
        )
      }
    }

    if (this.state.isDetected) {
      return (
        <div>
          <Button color="primary" onClick={this.handleAccept}>
            Add
          </Button>
          <Button color="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>
        </div>
      )
    } else {
      return (
        <div>
          {renderWebcamPower(this.state.isPlaying)}
          <Link to="/setting">
            <Button color="primary">Webcam Settings</Button>
          </Link>
          <Button color="primary" onClick={this.handleDialogOpen}>
            Recognize Settings
          </Button>
          {renderWebcamCapture(this.state.isPlaying)}
        </div>
      )
    }
  }

  renderMain = () => {
    const { videoSetting } = this.props

    const renderScreenShot = (
      <div
        style={{
          position: 'relative',
          width: videoSetting.width * this.state.videoSizeScale,
          height: videoSetting.height * this.state.videoSizeScale
        }}>
        <canvas
          className={this.props.classes.webcam}
          id={'register_screenshot'}
          width={videoSetting.width * this.state.videoSizeScale}
          height={videoSetting.height * this.state.videoSizeScale}
        />
        <canvas
          className={this.props.classes.webcamOverlay}
          id={'register_screenshot_overlay'}
          width={videoSetting.width * this.state.videoSizeScale}
          height={videoSetting.height * this.state.videoSizeScale}
        />
      </div>
    )

    const renderRegisterMenu = (
      <Card className={this.props.classes.paper}>
        <List component="nav">
          <Grid
            container={true}
            className={this.props.classes.grid}
            justify="center">
            <img src={this.state.registerForm.photo} alt={'profile'} />
          </Grid>
          <ListItem>
            <TextField
              label="Name"
              className={this.props.classes.textField}
              value={this.state.registerForm.name}
              error={this.state.registerFormError.name.onoff}
              helperText={this.state.registerFormError.name.message}
              onChange={this.handleForm('name')}
            />
          </ListItem>
          <ListItem>
            <TextField
              label="Email"
              className={this.props.classes.textField}
              value={this.state.registerForm.email}
              error={this.state.registerFormError.email.onoff}
              helperText={this.state.registerFormError.email.message}
              onChange={this.handleForm('email')}
            />
          </ListItem>
          <ListItem>
            <TextField
              label="Department"
              className={this.props.classes.textField}
              value={this.state.registerForm.department}
              error={this.state.registerFormError.department.onoff}
              helperText={this.state.registerFormError.department.message}
              onChange={this.handleForm('department')}
            />
          </ListItem>
        </List>
      </Card>
    )

    if (this.state.isPlaying) {
      return (
        <div className={this.props.classes.webcamContainer}>
          <WebcamCrop
            className={this.props.classes.webcam}
            audio={false}
            idCanvas={'register_webcamcrop'}
            videoWidth={videoSetting.width * this.state.videoSizeScale}
            videoHeight={videoSetting.height * this.state.videoSizeScale}
            videoConstraints={this.state.videoConstraints}
            cropx={videoSetting.x}
            cropy={videoSetting.y}
            cropwidth={videoSetting.width}
            cropheight={videoSetting.height}
          />
          <canvas
            className={this.props.classes.webcamOverlay}
            id={'register_webcamcrop_overlay'}
            width={videoSetting.width * this.state.videoSizeScale}
            height={videoSetting.height * this.state.videoSizeScale}
          />
        </div>
      )
    } else if (this.state.isCaptured) {
      if (this.state.isDetected) {
        return (
          <Grid
            container={true}
            className={this.props.classes.grid}
            justify="center"
            spacing={16}>
            <Grid item>{renderScreenShot}</Grid>
            <Grid item>{renderRegisterMenu}</Grid>
          </Grid>
        )
      }
      return renderScreenShot
    } else {
      return (
        <img src={imageRegister} alt={'register'} width={640} height={480} />
      )
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Layout
          helmet={true}
          title={'Register | Minazuki'}
          content={
            <Card className={this.props.classes.paper}>
              <Typography>Loading...</Typography>
              <LinearProgress />
              <img
                className={this.props.classes.hidden}
                id="initial_black"
                src={imageBlack}
                alt="initial_black"
              />
            </Card>
          }
        />
      )
    } else {
      return (
        <Layout
          helmet={true}
          title={'Register | Minazuki'}
          gridNormal={6}
          gridPhone={10}
          content={
            <Card className={this.props.classes.card}>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                open={this.state.snackStatus}
                autoHideDuration={6000}
                onClose={this.handleSnackClose}>
                <SnackbarContentWrapper
                  onClose={this.handleSnackClose}
                  variant={this.state.snackType}
                  message={this.state.snackMessage}
                />
              </Snackbar>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Register
                </Typography>
                <Divider className={this.props.classes.divider} />
                <Grid
                  container={true}
                  className={this.props.classes.grid}
                  justify="center">
                  {this.renderMain()}
                </Grid>
                <Divider className={this.props.classes.divider} />
                {this.renderButton()}

                {this.state.isBusy ? (
                  <div>
                    <Divider className={this.props.classes.divider} />
                    <Typography>Processing...</Typography>
                    <LinearProgress />
                  </div>
                ) : null}
                <DialogSetting
                  statusDialog={this.state.statusDialog}
                  statusFunction={this.handleDialogClose}
                  inputFunction={value => this.handleChange(value)}
                  videoSizeScale={this.state.videoSizeScale}
                  detectThreshold={this.state.detectThreshold}
                  detectSize={this.state.detectSize}
                />
              </CardContent>
            </Card>
          }
        />
      )
    }
  }
}

AdminRegister.propTypes = {
  classes: PropTypes.object.isRequired,
  videoSetting: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  })
}

const mapStateToProps = state => {
  return {
    videoSetting: state.reducerSetting,
    register: state.reducerRegister
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionR: bindActionCreators(actionRegister, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminRegister))
