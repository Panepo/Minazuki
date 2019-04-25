// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionFace from '../../actions/actionFace'
import * as actionInfo from '../../actions/actionInfo'
import type { StateFace } from '../../models/modelFace'
import { basename } from 'path'
import Layout from '../Layout'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

import DialogUpload from './DialogUpload'
import DialogDelete from './DialogDelete'
import DialogCamera from './DialogCamera'
import RenderList from './RenderList'

const styles = (theme: Object) => ({
  paper: {
    borderRadius: '2px',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '40px',
    paddingRight: '40px'
  }
})

type ProvidedProps = {
  classes: Object,
  match: any,
  width: string
}

type Props = {
  face: StateFace,
  actionsI: Dispatch,
  actionsF: Dispatch
}

type State = {
  isLoading: boolean,
  faces: string[],
  dialog: {
    delete: boolean,
    upload: boolean,
    camera: boolean
  },
  dialogKey: string
}

class AdminFace extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    faces: [],
    dialog: {
      delete: false,
      upload: false,
      camera: false
    },
    dialogKey: ''
  }

  componentDidMount = async () => {
    await this.props.actionsF.faceGetAll(this.props.match.params.user)
    this.setState({ isLoading: false })
  }

  static getDerivedStateFromProps(nextProps: ProvidedProps & Props) {
    if (nextProps.face.people) {
      return { faces: nextProps.face.people }
    } else return null
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================

  handleAccept = (target: string) => (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    event.preventDefault()
    switch (target) {
      case 'delete':
        this.props.actionsF.faceDelete({
          user: this.props.match.params.user,
          filename: basename(this.state.dialogKey)
        })
        this.setState({
          dialog: { ...this.state.dialog, [target]: false }
        })
        break
      default:
        break
    }
  }

  toggleDialog = (target: string, onoff: boolean, name: string) => () => {
    this.setState({
      dialog: { ...this.state.dialog, [target]: onoff },
      dialogKey: name
    })
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  render() {
    if (this.state.isLoading) {
      return (
        <Layout
          title={this.props.match.params.user + ' | Minazuki'}
          content={
            <Card className={this.props.classes.paper}>
              <Typography>Loading...</Typography>
              <LinearProgress />
            </Card>
          }
        />
      )
    }

    return (
      <Layout
        title={this.props.match.params.user + ' | Minazuki'}
        gridNormal={10}
        gridPhone={12}
        content={
          <div>
            <DialogDelete
              dialogStatus={this.state.dialog.delete}
              username={this.props.match.params.user}
              toggleDialog={this.toggleDialog}
              imageSrc={this.state.dialogKey}
              handleAccept={this.handleAccept}
            />
            <DialogUpload
              dialogStatus={this.state.dialog.upload}
              username={this.props.match.params.user}
              toggleDialog={this.toggleDialog}
            />
            <DialogCamera
              dialogStatus={this.state.dialog.camera}
              username={this.props.match.params.user}
              toggleDialog={this.toggleDialog}
              handleAccept={this.handleAccept}
            />
            <RenderList
              faces={this.state.faces}
              username={this.props.match.params.user}
              toggleDialog={this.toggleDialog}
            />
          </div>
        }
      />
    )
  }
}

AdminFace.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    face: state.reducerFace
  }
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
)(withStyles(styles)(AdminFace))
