// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionSetting from '../../actions/actionSetting'
import * as actionInfo from '../../actions/actionInfo'
import type { StateSetting } from '../../models/modelSetting'
import type {
  CanvasRect,
  CanvasRectError,
  VideoConstraints,
  VideoConstraintsError
} from '../../models/modelMisc'
import WebcamRectDraw from '../../componments/WebcamRectDraw'
import { validateRect, validateVideo } from '../../helpers/validate.helper'
import NumberFormat from 'react-number-format'
import { environment } from '../../environment'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import IconCamera from '@material-ui/icons/Camera'
import IconAccept from '@material-ui/icons/Done'
import IconCancel from '@material-ui/icons/Cancel'
import IconSensor from '@material-ui/icons/Contacts'
import IconList from '@material-ui/icons/AssignmentInd'

const imageSetting = require('../../images/setting.jpg')

const styles = (theme: Object) => ({
  formControl: {
    margin: theme.spacing.unit,
    width: 160
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  }
})

const NumberFormatCustom = (props: any) => {
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
    />
  )
}

type ProvidedProps = {
  classes: Object
}

type Props = {
  actionsS: Dispatch,
  actionsI: Dispatch,
  classes: Object,
  videoSetting: StateSetting,
  auth: Object
}

type State = {
  isPlaying: boolean,
  rect: CanvasRect,
  rectError: CanvasRectError,
  video: VideoConstraints,
  videoError: VideoConstraintsError
}

class PrivateSetting extends React.Component<ProvidedProps & Props, State> {
  constructor(props: ProvidedProps & Props) {
    super(props)
    this.state = {
      isPlaying: false,
      rect: this.props.videoSetting.rect,
      rectError: {
        x: { onoff: false, message: '' },
        y: { onoff: false, message: '' },
        width: { onoff: false, message: '' },
        height: { onoff: false, message: '' }
      },
      video: this.props.videoSetting.video,
      videoError: {
        width: { onoff: false, message: '' },
        height: { onoff: false, message: '' }
      }
    }
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
        isPlaying: true
      })
    }
  }

  handleGetPosition = (input: CanvasRect) => {
    this.setState({ rect: input })
  }

  handleAccept = () => {
    this.props.actionsS.modifyRect(this.state.rect)
    this.props.actionsS.modifyVideo(this.state.video)
    this.props.actionsI.infoSet({
      onoff: true,
      variant: 'info',
      message: 'Configuration set'
    })
  }

  handleCancel = () => {
    this.setState({
      rect: this.props.videoSetting.rect,
      rectError: {
        x: { onoff: false, message: '' },
        y: { onoff: false, message: '' },
        width: { onoff: false, message: '' },
        height: { onoff: false, message: '' }
      },
      video: this.props.videoSetting.video,
      videoError: {
        width: { onoff: false, message: '' },
        height: { onoff: false, message: '' }
      }
    })
  }

  handleInputRect = (column: string) => (event: any) => {
    if (event.target.value.length > 0) {
      const value = parseInt(event.target.value)
      const input = { ...this.state.rect, [column]: value }
      const error = validateRect(input)

      if (error.isValid) {
        this.setState({ rect: input, rectError: error.errors })
        this.props.actionsI.infoSet({
          onoff: true,
          variant: 'error',
          message: 'Invalid inputs'
        })
      } else {
        this.setState({
          rect: input,
          rectError: {
            x: { onoff: false, message: '' },
            y: { onoff: false, message: '' },
            width: { onoff: false, message: '' },
            height: { onoff: false, message: '' }
          }
        })
      }
    }
  }

  handleInputVideo = (column: string) => (event: any) => {
    if (event.target.value.length > 0) {
      const value = parseInt(event.target.value)
      const input = { ...this.state.video, [column]: value }
      const error = validateVideo(input)

      if (error.isValid) {
        this.setState({ video: input, videoError: error.errors })
        this.props.actionsI.infoSet({
          onoff: true,
          variant: 'error',
          message: 'Invalid inputs'
        })
      } else {
        this.setState({
          video: input,
          videoError: {
            width: { onoff: false, message: '' },
            height: { onoff: false, message: '' }
          }
        })
      }
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const renderToRegister = this.props.auth.user.admin ? (
      <Tooltip title="To All Users">
        <Link to="/list">
          <IconButton className={this.props.classes.icon} color="primary">
            <IconList />
          </IconButton>
        </Link>
      </Tooltip>
    ) : null

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

    return (
      <div>
        {renderWebcamPower}
        <Tooltip title="Set configuration">
          <IconButton
            className={this.props.classes.icon}
            onClick={this.handleAccept}
            color="primary">
            <IconAccept />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            className={this.props.classes.icon}
            onClick={this.handleCancel}
            color="primary">
            <IconCancel />
          </IconButton>
        </Tooltip>
        <Tooltip title="To face recognize sensor">
          <Link to="/sensor">
            <IconButton className={this.props.classes.icon} color="primary">
              <IconSensor />
            </IconButton>
          </Link>
        </Tooltip>
        {renderToRegister}
      </div>
    )
  }

  renderWebCam = () => {
    if (this.state.isPlaying) {
      return (
        <WebcamRectDraw
          audio={false}
          videoWidth={environment.videoCanvas.width}
          videoHeight={environment.videoCanvas.height}
          videoConstraints={this.props.videoSetting.video}
          rectColor={'lime'}
          getPosition={rect => this.handleGetPosition(rect)}
          rect={this.state.rect}
        />
      )
    } else {
      return <img src={imageSetting} alt={'setting'} width={640} height={480} />
    }
  }

  renderInputRect = () => {
    const listRect = ['x', 'y', 'width', 'height']

    return listRect.reduce((output: any[], data: string, i: number) => {
      output.push(
        <TextField
          id={data}
          key={data + i.toString()}
          label={'Rect:' + data}
          error={this.state.rectError[data].onoff}
          helperText={this.state.rectError[data].message}
          className={this.props.classes.formControl}
          value={this.state.rect[data]}
          onInput={this.handleInputRect(data)}
          margin="normal"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />
      )
      return output
    }, [])
  }

  renderInputVideo = () => {
    const listVideo = ['width', 'height']

    return listVideo.reduce((output: any[], data: string, i: number) => {
      output.push(
        <TextField
          id={data}
          key={data + i.toString()}
          label={'Video:' + data}
          error={this.state.videoError[data].onoff}
          helperText={this.state.videoError[data].message}
          className={this.props.classes.formControl}
          value={this.state.video[data]}
          onInput={this.handleInputVideo(data)}
          margin="normal"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />
      )
      return output
    }, [])
  }

  render() {
    return (
      <Layout
        helmet={true}
        title={'Camera Settings'}
        gridNormal={6}
        gridPhone={10}
        content={
          <Card className={this.props.classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Camera Settings
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
              <div>{this.renderInputRect()}</div>
              <div>{this.renderInputVideo()}</div>
            </CardContent>
          </Card>
        }
      />
    )
  }
}

PrivateSetting.propTypes = {
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
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    videoSetting: state.reducerSetting,
    auth: state.reducerAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionsS: bindActionCreators(actionSetting, dispatch),
    actionsI: bindActionCreators(actionInfo, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PrivateSetting))
