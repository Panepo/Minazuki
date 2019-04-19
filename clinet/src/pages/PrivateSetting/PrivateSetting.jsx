// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionSetting from '../../actions/actionSetting'
import type {
  StateSetting,
  StateSettingError,
  PayloadSetting
} from '../../models/modelSetting'
import WebcamRectDraw from '../../componments/WebcamRectDraw'
import { validateCameraSetting } from '../../helpers/validate.helper'
// import Webcam from 'react-webcam'
import NumberFormat from 'react-number-format'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

const imageSetting = require('../../images/setting.jpg')

const styles = (theme: Object) => ({
  formControl: {
    margin: theme.spacing.unit,
    width: 160
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  overlay: {
    zIndex: 10,
    marginTop: '-370px'
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
  classes: Object,
  videoSetting: StateSetting,
  auth: Object
}

type State = {
  isPlaying: boolean,
  videoConstraints: {
    width: number,
    height: number
  },
  videoSettingError: StateSettingError
}

class PrivateSetting extends React.Component<ProvidedProps & Props, State> {
  state = {
    isPlaying: false,
    videoConstraints: {
      width: 1280,
      height: 720
    },
    videoSettingError: {
      x: { onoff: false, message: '' },
      y: { onoff: false, message: '' },
      width: { onoff: false, message: '' },
      height: { onoff: false, message: '' }
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

  handleInputChange = (column: string) => (event: any) => {
    if (event.target.value.length > 0) {
      const value = parseInt(event.target.value)
      const error = validateCameraSetting(column, value)
      if (error) {
        this.setState({
          videoSettingError: {
            ...this.state.videoSettingError,
            [error.column]: { onoff: true, message: error.message }
          }
        })
      } else {
        const input: PayloadSetting = {
          column: column,
          value: value
        }
        this.props.actionsS.modifySetting(input)
        this.setState({
          videoSettingError: {
            x: { onoff: false, message: '' },
            y: { onoff: false, message: '' },
            width: { onoff: false, message: '' },
            height: { onoff: false, message: '' }
          }
        })
      }
    }
  }

  handleGetPosition = (rect: StateSetting) => {
    this.props.actionsS.modifyRect(rect)
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const renderToSensor = () => {
      if (this.props.auth.user.admin) {
        return (
          <Link to="/sensor">
            <Button color="primary">Sensor</Button>
          </Link>
        )
      } else {
        return (
          <Link to="/sensor">
            <Button color="primary">Accept</Button>
          </Link>
        )
      }
    }

    const renderToRegister = () => {
      if (this.props.auth.user.admin) {
        return (
          <Link to="/register">
            <Button color="primary">Register</Button>
          </Link>
        )
      }
    }

    const renderWebcamPower = (onoff: boolean) => {
      if (onoff) {
        return (
          <div>
            <Button color="secondary" onClick={this.handleWebcam}>
              Webcam Stop
            </Button>
            {renderToSensor()}
            {renderToRegister()}
          </div>
        )
      } else {
        return (
          <div>
            <Button color="primary" onClick={this.handleWebcam}>
              Webcam Start
            </Button>
            {renderToSensor()}
            {renderToRegister()}
          </div>
        )
      }
    }

    return renderWebcamPower(this.state.isPlaying)
  }

  renderWebCam = () => {
    if (this.state.isPlaying) {
      return (
        <WebcamRectDraw
          audio={false}
          videoWidth={640}
          videoHeight={360}
          videoConstraints={this.state.videoConstraints}
          rectColor={'lime'}
          getPosition={rect => this.handleGetPosition(rect)}
          rect={this.props.videoSetting}
        />
      )
    } else {
      return <img src={imageSetting} alt={'setting'} width={640} height={480} />
    }
  }

  renderInput = () => {
    const listInput = ['x', 'y', 'width', 'height']

    return listInput.reduce((output: any[], data: string, i: number) => {
      output.push(
        <TextField
          id={data}
          key={data + i.toString()}
          label={data}
          error={this.state.videoSettingError[data].onoff}
          helperText={this.state.videoSettingError[data].message}
          className={this.props.classes.formControl}
          value={this.props.videoSetting[data]}
          onInput={this.handleInputChange(data)}
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
        title={'Camera Settings | Minazuki'}
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
              {this.renderInput()}
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
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
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
    actionsS: bindActionCreators(actionSetting, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PrivateSetting))
