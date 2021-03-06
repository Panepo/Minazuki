// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionInfo from '../../actions/actionInfo'
import * as actionData from '../../actions/actionData'
import * as actionRecord from '../../actions/actionRecord'
import * as actionPeople from '../../actions/actionPeople'
import type { StateData } from '../../models/modelData'
import type { StateRecord, RecordData } from '../../models/modelRecord'
import type { StateSetting } from '../../models/modelSetting'
import * as faceapi from 'face-api.js'
import { createFaceMatcher } from '../../helpers/face.helper'
import { environment } from '../../environment'
import { loadModel, modelInitial } from '../../helpers/model.helper'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import WebcamCrop from '../../componments/WebcamCrop'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import IconCamera from '@material-ui/icons/Camera'
import IconSettings from '@material-ui/icons/Settings'
import IconSensor from '@material-ui/icons/Contacts'
import IconRecord from '@material-ui/icons/RecordVoiceOver'
import IconRecords from '@material-ui/icons/LibraryBooks'

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
  data: StateData,
  record: StateRecord,
  videoSetting: StateSetting,
  actionsI: Dispatch,
  actionsD: Dispatch,
  actionsR: Dispatch,
  actionsP: Dispatch
}

type State = {
  isLoading: boolean,
  isPlaying: boolean,
  isSensing: boolean,
  isRecording: boolean,
  processTime: string
}

class PrivateSensor extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    isPlaying: false,
    isSensing: false,
    isRecording: false,
    processTime: '0'
  }
  interval: number = 0
  tick: number = 0
  faceMatcher = null

  componentDidMount = async () => {
    if (this.props.data.data.length === 0) {
      this.props.actionsD.dataLoad()
      this.props.actionsI.infoSet({
        onoff: true,
        variant: 'info',
        message: 'Face data loaded from server.'
      })
    } else {
      this.props.actionsI.infoSet({
        onoff: true,
        variant: 'info',
        message: 'Face data loaded from clinet training.'
      })
    }
    await this.props.actionsP.peopleGetAll()
    await loadModel()
    await modelInitial('initial_black')

    this.setState({ isLoading: false })
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================
  handleWebcam = () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
        isSensing: false
      })
    } else {
      this.setState({
        isPlaying: true
      })
    }
  }

  handleSense = async () => {
    if (this.state.isSensing) {
      window.clearInterval(this.interval)
      const canvas = document.getElementById('sensor_webcamcrop_overlay')
      if (canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(
          0,
          0,
          this.props.videoSetting.rect.width * 2,
          this.props.videoSetting.rect.height * 2
        )
      }
      this.setState({
        isSensing: false
      })
    } else {
      this.faceMatcher = await createFaceMatcher(this.props.data.data, 0.4)
      this.interval = window.setInterval(async () => await this.faceMain(), 10)
      this.setState({
        isSensing: true
      })
    }
  }

  handleRecord = () => {
    if (this.state.isRecording) {
      this.setState({
        isRecording: false
      })
    } else {
      this.setState({
        isRecording: true
      })
    }
  }

  // ================================================================================
  // Facec recognition functions
  // ================================================================================
  faceMain = async () => {
    const image = document.getElementById('sensor_webcamcrop')
    const canvas = document.getElementById('sensor_webcamcrop_overlay')
    if (
      canvas instanceof HTMLCanvasElement &&
      image instanceof HTMLCanvasElement
    ) {
      await this.faceRecognize(canvas, image)
      const tend = performance.now()
      const tickProcess = Math.floor(tend - this.tick).toString() + ' ms'
      const anchor = { x: 0, y: this.props.videoSetting.rect.height * 2 }
      const drawOptions = {
        anchorPosition: 'TOP_LEFT',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontColor: 'yellow'
      }
      const drawBox = new faceapi.draw.DrawTextField(
        tickProcess,
        anchor,
        drawOptions
      )
      drawBox.draw(canvas)
      this.tick = tend
    }
  }

  faceRecognize = async (
    canvas: HTMLCanvasElement,
    image: HTMLCanvasElement
  ) => {
    const results = await faceapi
      .detectAllFaces(
        image,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: environment.tinyInputSize,
          scoreThreshold: environment.tinyThreshold
        })
      )
      .withFaceLandmarks(environment.useTinyLandmark)
      .withFaceDescriptors()

    if (results) {
      faceapi.matchDimensions(canvas, image)
      const resizedResults = faceapi.resizeResults(results, image)
      resizedResults.forEach(({ detection, descriptor }) => {
        // $flow-disable-line
        const label = this.faceMatcher.findBestMatch(descriptor).toString()
        const options = { label }
        const drawBox = new faceapi.draw.DrawBox(detection.box, options)
        drawBox.draw(canvas)

        if (this.state.isRecording) {
          const labelSplit = label.split(' ')
          const record: RecordData = {
            name: labelSplit[0],
            date: Date.now()
          }
          this.props.actionsR.recordAdd(record)
        }
      })
    } else {
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================
  renderButton = () => {
    const renderWebcamPower = this.state.isPlaying ? (
      <Tooltip title="Webcam stop">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleWebcam}
          color="secondary">
          <IconCamera />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Webcam start">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleWebcam}
          color="primary">
          <IconCamera />
        </IconButton>
      </Tooltip>
    )

    const renderRecognize = this.state.isSensing ? (
      <Tooltip title="Recognize stop">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleSense}
          color="secondary">
          <IconSensor />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Recognize start">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleSense}
          color="primary">
          <IconSensor />
        </IconButton>
      </Tooltip>
    )

    const renderRecord = this.state.isRecording ? (
      <Tooltip title="Record stop">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleRecord}
          color="secondary">
          <IconRecord />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Record start">
        <IconButton
          className={this.props.classes.icon}
          onClick={this.handleRecord}
          color="primary">
          <IconRecord />
        </IconButton>
      </Tooltip>
    )

    return (
      <CardActions>
        {renderWebcamPower}
        <Tooltip title="Camera settings">
          <Link to="/setting">
            <IconButton className={this.props.classes.icon} color="primary">
              <IconSettings />
            </IconButton>
          </Link>
        </Tooltip>
        {this.state.isPlaying ? renderRecognize : null}
        {this.state.isSensing ? renderRecord : null}
        <Tooltip title="To Face Recognization Record">
          <Link to="/record">
            <IconButton className={this.props.classes.icon} color="primary">
              <IconRecords />
            </IconButton>
          </Link>
        </Tooltip>
      </CardActions>
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
            videoWidth={videoSetting.rect.width * 2}
            videoHeight={videoSetting.rect.height * 2}
            videoConstraints={videoSetting.video}
            cropx={videoSetting.rect.x}
            cropy={videoSetting.rect.y}
            cropwidth={videoSetting.rect.width}
            cropheight={videoSetting.rect.height}
          />
          <canvas
            className={this.props.classes.webcamOverlay}
            id={'sensor_webcamcrop_overlay'}
            width={videoSetting.rect.width * 2}
            height={videoSetting.rect.height * 2}
          />
        </div>
      )
    } else {
      return <img src={imageSensor} alt={'setting'} width={640} height={480} />
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Layout
          helmet={true}
          title={'Sensor'}
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
    }

    return (
      <Layout
        helmet={true}
        title={'Sensor'}
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
            </CardContent>
            {this.renderButton()}
          </Card>
        }
      />
    )
  }
}

PrivateSensor.propTypes = {
  classes: PropTypes.object.isRequired,
  videoSetting: PropTypes.shape({
    rect: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number
    }),
    video: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  }),
  data: PropTypes.object,
  record: PropTypes.object
}

const mapStateToProps = state => {
  return {
    data: state.reducerData,
    record: state.reducerRecord,
    videoSetting: state.reducerSetting
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionsR: bindActionCreators(actionRecord, dispatch),
    actionsI: bindActionCreators(actionInfo, dispatch),
    actionsD: bindActionCreators(actionData, dispatch),
    actionsP: bindActionCreators(actionPeople, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PrivateSensor))
