// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionRecognize from '../../actions/actionRecognize'
import type { StateSetting } from '../../models/modelSetting'
import type { StateRecognize } from '../../models/modelRecognize'
import type { FaceData } from '../../models/modelRecognize'
import * as faceapi from 'face-api.js'
import {
  resizeCanvasAndResults,
  drawFPS,
  findMatch
} from '../../helpers/face.helper'
import WebcamCrop from '../../componments/WebcamCrop'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import DialogSetting from './DialogSetting'
import axios from 'axios'

const imageSensor = require('../../images/sensor.jpg')
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
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  videoSetting: StateSetting,
  actionR: Dispatch,
  recognize: StateRecognize
}

type State = {
  isLoading: boolean,
  isPlaying: boolean,
  isPredicting: boolean,
  switchRecognize: boolean,
  isUpdating: boolean,
  videoBuff: null,
  videoConstraints: {
    width: number,
    height: number
  },
  videoSizeScale: number,
  detectThreshold: number,
  detectSize: number,
  tickPredict: number,
  statusDialog: boolean,
  faceData: FaceData[]
}

class PrivateSensor extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    isPlaying: false,
    isPredicting: false,
    switchRecognize: false,
    isUpdating: false,
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
    faceData: []
  }
  interval: number = 0

  componentDidMount = async () => {
    await faceapi.loadTinyFaceDetectorModel('/models')
    await faceapi.loadFaceLandmarkTinyModel('/models')
    await faceapi.loadFaceRecognitionModel('/models')
    const initial = document.getElementById('initial_black')
    await faceapi
      .detectAllFaces(
        initial,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: this.state.detectSize,
          scoreThreshold: this.state.detectThreshold / 100
        })
      )
      .withFaceLandmarks(true)
      .withFaceDescriptors()
    this.setState({ isLoading: false })
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================
  handleChange = (value: string) => (event: any) => {
    if (event.target.value.length > 0) {
      this.setState({ [value]: event.target.value })
    }
  }

  handleDialogOpen = () => {
    this.setState({ statusDialog: true })
    if (this.state.isPredicting) {
      window.clearInterval(this.interval)
      const canvas = document.getElementById('sensor_webcamcrop_overlay')
      if (canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(
          0,
          0,
          this.props.videoSetting.width * this.state.videoSizeScale,
          this.props.videoSetting.width * this.state.videoSizeScale
        )
      }
      this.setState({ isPredicting: false })
    }
  }

  handleDialogClose = () => {
    this.setState({ statusDialog: false })
  }

  handleWebcam = () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
        isPredicting: false
      })
    } else {
      this.setState({
        isPlaying: true,
        isPredicting: false
      })
    }
  }

  handlePredict = () => {
    if (this.state.isPredicting) {
      window.clearInterval(this.interval)
      const canvas = document.getElementById('sensor_webcamcrop_overlay')
      if (canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(
          0,
          0,
          this.props.videoSetting.width * this.state.videoSizeScale,
          this.props.videoSetting.width * this.state.videoSizeScale
        )
      }
      this.setState({ isPredicting: false })
    } else {
      this.interval = window.setInterval(
        () => this.handlePredictTick(),
        this.state.tickPredict
      )
      this.setState({ isPredicting: true })
    }
  }

  handlePredictTick = async () => {
    const image = document.getElementById('sensor_webcamcrop')
    const canvas = document.getElementById('sensor_webcamcrop_overlay')
    if (
      canvas instanceof HTMLCanvasElement &&
      image instanceof HTMLCanvasElement
    ) {
      const tstart = performance.now()
      await this.processFaceRecognize(canvas, image)
      const tend = performance.now()
      const tickProcess = Math.floor(tend - tstart).toString() + ' ms'
      drawFPS(canvas, tickProcess, 'lime', {
        x: 10,
        y: this.props.videoSetting.height * this.state.videoSizeScale - 10
      })
    }
  }

  // ================================================================================
  // Facec recognition functions
  // ================================================================================
  processFaceRecognize = async (
    canvas: HTMLCanvasElement,
    image: HTMLCanvasElement
  ) => {
    const results = await faceapi
      .detectAllFaces(
        image,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: this.state.detectSize,
          scoreThreshold: this.state.detectThreshold / 100
        })
      )
      .withFaceLandmarks(true)
      .withFaceDescriptors()

    if (results) {
      const resizedResults = resizeCanvasAndResults(image, canvas, results)
      /* const boxesWithText = await Promise.all(
        resizedResults.map(async ({ detection, descriptor }) =>
          new faceapi.BoxWithText(detection.box, findMatch(descriptor, this.state.faceData, 0.5))
        )
      ) */
      const boxesWithText = []
      resizedResults.forEach(element => {
        const text = findMatch(element.descriptor, this.state.faceData, 0.5)
        this.processUpdateFace(element.descriptor)
        boxesWithText.push(new faceapi.BoxWithText(element.detection.box, text))
      })

      faceapi.drawDetection(canvas, boxesWithText, { boxColor: 'lime' })
    }
  }

  processUpdateFace = descriptor => {
    if (!this.state.isUpdating) {
      this.setState({ isUpdating: true }, () =>
        axios
          .post('/data/findMatch', { descriptor: descriptor })
          .then(res => {
            this.setState({ isUpdating: false })
            console.log(res)
          })
          .catch(err => {
            console.log(err.response)
            this.setState({ isUpdating: false })
          })
      )
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

    const renderRecognize = (onoff1: boolean, onoff2: boolean) => {
      if (onoff1) {
        if (onoff2) {
          return (
            <Button color="secondary" onClick={this.handlePredict}>
              Recognize Stop
            </Button>
          )
        } else {
          return (
            <Button color="primary" onClick={this.handlePredict}>
              Recognize Start
            </Button>
          )
        }
      }
    }

    return (
      <div>
        {renderWebcamPower(this.state.isPlaying)}
        <Link to="/setting">
          <Button color="primary">Webcam Settings</Button>
        </Link>
        {renderRecognize(this.state.isPlaying, this.state.isPredicting)}
        <Button color="primary" onClick={this.handleDialogOpen}>
          Recognize Settings
        </Button>
      </div>
    )
  }

  renderWebCam = () => {
    const { videoSetting } = this.props

    if (this.state.isPlaying) {
      return (
        <div className={this.props.classes.webcamContainer}>
          <WebcamCrop
            className={this.props.classes.webcam}
            audio={false}
            idCanvas={'sensor_webcamcrop'}
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
            id={'sensor_webcamcrop_overlay'}
            width={videoSetting.width * this.state.videoSizeScale}
            height={videoSetting.height * this.state.videoSizeScale}
          />
        </div>
      )
    } else {
      return <img src={imageSensor} alt={'sensor'} width={640} height={480} />
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Layout
          helmet={true}
          title={'Sensor | Minazuki'}
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
          title={'Sensor | Minazuki'}
          gridNormal={6}
          gridPhone={10}
          content={
            <Card className={this.props.classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Sensor
                </Typography>
                <Divider className={this.props.classes.divider} />
                <Grid
                  container={true}
                  className={this.props.classes.grid}
                  justify="center">
                  {this.renderWebCam()}
                </Grid>
                <Divider className={this.props.classes.divider} />
                {this.renderButton()}
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

PrivateSensor.propTypes = {
  classes: PropTypes.object.isRequired,
  videoSetting: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  })
}

const mapStateToProps = state => {
  return {
    videoSetting: state.reducerSetting,
    recognize: state.reducerRegister
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionR: bindActionCreators(actionRecognize, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PrivateSensor))
