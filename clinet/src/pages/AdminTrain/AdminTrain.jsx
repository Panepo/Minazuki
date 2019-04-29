// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionPeople from '../../actions/actionPeople'
import * as actionInfo from '../../actions/actionInfo'
import * as actionData from '../../actions/actionData'
import type { PeopleData } from '../../models/modelPeople'
import type { StateData } from '../../models/modelData'
import * as faceapi from 'face-api.js'
import Layout from '../Layout'
import Loading from '../Loading'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tooltip from '@material-ui/core/Tooltip'
import ImageGridList from '../../componments/ImageGridList'
import { extractImagePath } from '../../helpers/file.helper'

const styles = (theme: Object) => ({
  divider: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  imageList: {
    height: 400
  },
  hidden: {
    display: 'none'
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  peoples: PeopleData[],
  data: StateData,
  actionsP: Dispatch,
  actionsI: Dispatch,
  actionsD: Dispatch
}

type State = {
  isLoading: boolean,
  isBusy: boolean,
  list: any,
  processTime: string
}

class AdminTrain extends React.Component<ProvidedProps & Props, State> {
  constructor(props: ProvidedProps & Props) {
    super(props)
    this.state = {
      isLoading: true,
      isBusy: false,
      list: extractImagePath(props.peoples),
      processTime: '0'
    }
  }

  componentDidMount = async () => {
    await this.props.actionsP.peopleGetAll()
    await faceapi.loadTinyFaceDetectorModel('/models')
    await faceapi.loadFaceLandmarkTinyModel('/models')
    await faceapi.loadFaceRecognitionModel('/models')
    this.setState({ isLoading: false })
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================

  handleTrain = () => {
    this.setState({ isBusy: true }, () => this.FaceTrain())
  }

  handleSave = () => {
    this.props.actionsD.dataSave({ data: this.props.data.data })
  }

  handleLoad = () => {
    this.props.actionsD.dataLoad()
  }

  handleImport = (event: any) => {
    const files = event.target.files
    if (files.length > 0) {
      let fr = new FileReader()
      fr.onload = e => {
        this.props.actionsD.dataImport(JSON.parse(e.target.result))
      }
      fr.readAsText(files.item(0))
    }
  }

  handleExport = () => {
    const data =
      'text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(this.props.data.data))
    let downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', 'data:' + data)
    downloadAnchorNode.setAttribute('download', 'faces.json')
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  // ================================================================================
  // Facec recognition functions
  // ================================================================================
  FaceTrain = async () => {
    const tstart = performance.now()
    const labeledDescriptors = []

    await Promise.all(
      this.props.peoples.map(async people => {
        const descriptors = []

        await Promise.all(
          people.files.map(async file => {
            const image = await faceapi.fetchImage(file)
            descriptors.push(await faceapi.computeFaceDescriptor(image))
          })
        )

        if (descriptors.length > 0) {
          labeledDescriptors.push(
            new faceapi.LabeledFaceDescriptors(people.name, descriptors)
          )
        }
      })
    )

    const tend = performance.now()
    this.setState({
      isBusy: false,
      processTime: Math.floor(tend - tstart).toString() + ' ms'
    })

    if (labeledDescriptors.length > 0) {
      this.props.actionsD.dataImport(labeledDescriptors)
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  render() {
    if (this.state.isLoading) {
      return <Loading helmet={true} title={'Face Training | Minazuki'} />
    }

    return (
      <Layout
        helmet={true}
        title={'Face Training | Minazuki'}
        gridNormal={8}
        gridPhone={10}
        content={
          <Card className={this.props.classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Face Training
              </Typography>
              <ImageGridList
                className={this.props.classes.imageList}
                tileData={this.state.list}
                cellHeight={100}
                cellCols={10}
              />
            </CardContent>
            <CardActions>
              <Tooltip title="Training to get face data">
                <Button color="primary" onClick={this.handleTrain}>
                  Train
                </Button>
              </Tooltip>
              <Tooltip title="Load face data from server">
                <Button color="primary" onClick={this.handleLoad}>
                  Load
                </Button>
              </Tooltip>
              {this.props.data.data.length > 0 ? (
                <Tooltip title="Save face data to server">
                  <Button color="primary" onClick={this.handleSave}>
                  Save
                  </Button>
                </Tooltip>
              ) : null}
              <Tooltip title="Import face data from computer">
                <Button color="primary" component="label">
                  Import
                  <input
                    className={this.props.classes.hidden}
                    type="file"
                    accept="application/json"
                    onChange={this.handleImport}
                  />
                </Button>
              </Tooltip>
              {this.props.data.data.length > 0 ? (
                <Tooltip title="Export face data to computer">
                  <Button color="primary" onClick={this.handleExport}>
                    Export
                  </Button>
                </Tooltip>
              ) : null}
              <Link to="/sensor">
                <Button color="primary">Sensor</Button>
              </Link>
              <Link to="/list">
                <Button color="primary">List</Button>
              </Link>
            </CardActions>
            <CardContent>
              <TextField label="Process time" value={this.state.processTime} />
              {this.state.isBusy ? (
                <div>
                  <Typography>Training...</Typography>
                  <LinearProgress />
                </div>
              ) : null}
            </CardContent>
          </Card>
        }
      />
    )
  }
}

AdminTrain.propTypes = {
  classes: PropTypes.object.isRequired,
  peoples: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    peoples: state.reducerPeople.peoples,
    data: state.reducerData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionsP: bindActionCreators(actionPeople, dispatch),
    actionsI: bindActionCreators(actionInfo, dispatch),
    actionsD: bindActionCreators(actionData, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminTrain))
