// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import Webcam, { audioConstraintType, videoConstraintType } from './Webcam'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme: Object) => ({
  hidden: {
    display: 'none'
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  rectx: number,
  recty: number,
  rectwidth: number,
  rectheight: number,
  rectColor: string,
  audio: boolean,
  videoWidth: number,
  videoHeight: number,
  tickRender: number,
  idVideo: string,
  idCanvas: string,
  audioConstraints: Object,
  videoConstraints: Object
}

class WebcamRect extends React.Component<ProvidedProps & Props> {
  static propTypes = {
    idVideo: PropTypes.string,
    idCanvas: PropTypes.string,
    classes: PropTypes.object.isRequired,
    videoWidth: PropTypes.number.isRequired,
    videoHeight: PropTypes.number.isRequired,
    tickRender: PropTypes.number.isRequired,
    audio: PropTypes.bool.isRequired,
    rectx: PropTypes.number.isRequired,
    recty: PropTypes.number.isRequired,
    rectwidth: PropTypes.number.isRequired,
    rectheight: PropTypes.number.isRequired,
    rectColor: PropTypes.string.isRequired,
    audioConstraints: audioConstraintType,
    videoConstraints: videoConstraintType
  }

  static defaultProps = {
    idVideo: 'react-webcam-rect',
    idCanvas: 'react-webcam-rect-canvas',
    videoWidth: 640,
    videoHeight: 480,
    tickRender: 100,
    audio: false,
    rectx: 0,
    recty: 0,
    rectwidth: 640,
    rectheight: 480,
    rectColor: 'yellow'
  }
  interval: number = 0
  webcam: HTMLVideoElement | null

  componentDidMount() {
    this.interval = window.setInterval(
      () => this.handleRender(),
      this.props.tickRender
    )
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  handleRender = () => {
    const video = document.getElementById(this.props.idVideo)
    const canvas = document.getElementById(this.props.idCanvas)

    if (
      canvas instanceof HTMLCanvasElement &&
      video instanceof HTMLVideoElement
    ) {
      canvas.width = this.props.videoWidth
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        video,
        0,
        0,
        this.props.videoConstraints.width,
        this.props.videoConstraints.height,
        0,
        0,
        this.props.videoWidth,
        this.props.videoHeight
      )
      ctx.strokeStyle = this.props.rectColor
      ctx.rect(
        this.props.rectx,
        this.props.recty,
        this.props.rectwidth,
        this.props.rectheight
      )
      ctx.stroke()
    }
  }

  render() {
    return (
      <div>
        <Webcam
          className={this.props.classes.hidden}
          id={this.props.idVideo}
          audio={this.props.audio}
          width={this.props.videoWidth}
          height={this.props.videoHeight}
          ref={node => (this.webcam = node)}
          videoConstraints={this.props.videoConstraints}
          audioConstraints={this.props.audioConstraints}
        />
        <canvas
          id={this.props.idCanvas}
          width={this.props.videoWidth}
          height={this.props.videoHeight}
        />
      </div>
    )
  }
}

export default withStyles(styles)(WebcamRect)
