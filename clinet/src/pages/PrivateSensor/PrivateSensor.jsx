// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionInfo from '../../actions/actionInfo'
import * as actionData from '../../actions/actionData'
import * as actionRecord from '../../actions/actionRecord'

import type { StateData } from '../../models/modelData'
import type { StateRecord } from '../../models/modelRecord'
import type { StateSetting } from '../../models/modelSetting'

import * as faceapi from 'face-api.js'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import WebcamCrop from '../../componments/WebcamCrop'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'

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
  actionsP: Dispatch,
  actionsI: Dispatch,
  actionsD: Dispatch
}

type State = {
  isLoading: boolean,
  isPlaying: boolean,
  isSensing: boolean,
  processTime: string,
  detectThreshold: number,
  detectSize: number
}

class PrivateSensor extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: false,
    isPlaying: false,
    isSensing: false,
    processTime: '0',
    detectThreshold: 50,
    detectSize: 160
  }
  interval: number = 0

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

  handleSense = () => {}

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

    const renderRecognize = this.state.isSensing ? (
      <Button color="secondary" onClick={this.handleSense}>
        Recognize Stop
      </Button>
    ) : (
      <Button color="primary" onClick={this.handleSense}>
        Recognize Start
      </Button>
    )

    return (
      <CardActions>
        {renderWebcamPower}
        <Link to="/setting">
          <Button color="primary">Settings</Button>
        </Link>
        {this.state.isPlaying ? renderRecognize : null}
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
    }

    return (
      <Layout
        helmet={true}
        title={'Sensor | Minazuki'}
        gridNormal={8}
        gridPhone={10}
        content={
          <Card className={this.props.classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Sensor
              </Typography>
              {this.renderWebCam()}
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
  videoSetting: PropTypes.object
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
    actionsD: bindActionCreators(actionData, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PrivateSensor))
