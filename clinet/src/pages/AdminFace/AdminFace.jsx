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
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import IconDelete from '@material-ui/icons/Delete'
import IconCamera from '@material-ui/icons/Camera'
import IconUpload from '@material-ui/icons/CloudUpload'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import ImageGallery from '../../componments/ImageGallery'

const imageFace = require('../../images/face.jpg')

const styles = (theme: Object) => ({
  paper: {
    borderRadius: '2px',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '40px',
    paddingRight: '40px'
  },
  gridList: {
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  icon: {
    color: 'white'
  },
  hidden: {
    display: 'none'
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
  dialogKey: string,
  isUploaded: boolean,
  imageFile: string[],
  imageForm: FormData | null
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
    dialogKey: '',
    isUploaded: false,
    imageFile: [],
    imageForm: null
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
      case 'upload':
        this.props.actionsF.faceAdd(this.state.imageForm)
        this.setState({
          dialog: { ...this.state.dialog, [target]: false }
        })
        break
      default:
        break
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
    formData.append('user', this.props.match.params.user)
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
        isUploaded: true,
        imageForm: formData
      })
    } else {
      this.setState({
        imageFile: [],
        isUploaded: false,
        imageForm: null
      })
    }
  }

  toggleDialog = (target: string, onoff: boolean, name: string) => () => {
    this.setState({
      dialog: { ...this.state.dialog, [target]: onoff },
      dialogKey: name,
      imageFile: []
    })
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  render() {
    const renderList = this.state.faces.map(file => (
      <GridListTile key={file} cols={1} rows={1}>
        <img src={file} alt={this.props.match.params.user} height={256} />
        <GridListTileBar
          title={basename(file)}
          titlePosition="bottom"
          actionIcon={
            <Tooltip title="Delete file">
              <IconButton
                className={this.props.classes.icon}
                onClick={this.toggleDialog('delete', true, file)}>
                <IconDelete />
              </IconButton>
            </Tooltip>
          }
          actionPosition="right"
          className={this.props.classes.titleBar}
        />
      </GridListTile>
    ))

    const renderAdd = (
      <GridListTile cols={1} rows={1}>
        <img src={imageFace} alt={'new face'} height={256} />
        <GridListTileBar
          title={'Add face'}
          titlePosition="bottom"
          actionIcon={
            <div>
              <Tooltip title="Start camera">
                <IconButton
                  className={this.props.classes.icon}
                  onClick={this.toggleDialog('camera', true, '')}>
                  <IconCamera />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload from file">
                <IconButton
                  className={this.props.classes.icon}
                  onClick={this.toggleDialog('upload', true, '')}>
                  <IconUpload />
                </IconButton>
              </Tooltip>
            </div>
          }
          actionPosition="right"
          className={this.props.classes.titleBar}
        />
      </GridListTile>
    )

    const renderDialogDelete = (
      <Dialog
        open={this.state.dialog.delete}
        onClose={this.toggleDialog('delete', false, '')}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'xl'}>
        <DialogTitle id="select-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <img src={this.state.dialogKey} alt={'delete'} height={256} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleAccept('delete')} color="primary">
            Accept
          </Button>
          <Button
            onClick={this.toggleDialog('delete', false, '')}
            color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )

    const renderDialogUpload = (
      <Dialog
        open={this.state.dialog.upload}
        onClose={this.toggleDialog('upload', false, '')}
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
          <Button onClick={this.handleAccept('upload')} color="primary">
            Accept
          </Button>
          <Button
            onClick={this.toggleDialog('upload', false, '')}
            color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )

    const renderDialogCamera = (
      <Dialog
        open={this.state.dialog.camera}
        onClose={this.toggleDialog('camera', false, '')}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'xl'}>
        <DialogTitle id="select-dialog-title">Camera</DialogTitle>
        <DialogContent>FQ</DialogContent>
        <DialogActions>
          <Button onClick={this.handleAccept('camera')} color="primary">
            Accept
          </Button>
          <Button
            onClick={this.toggleDialog('camera', false, '')}
            color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )

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
            {renderDialogDelete}
            {renderDialogUpload}
            {renderDialogCamera}
            <GridList
              cellHeight={256}
              cols={6}
              spacing={1}
              className={this.props.classes.gridList}>
              {renderList}
              {renderAdd}
            </GridList>
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
)(withStyles(styles)(withRouter(AdminFace)))
