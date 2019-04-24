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
  faces: string[]
}

class AdminFace extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    faces: []
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
            <GridList
              cellHeight={256}
              cols={6}
              spacing={1}
              className={this.props.classes.gridList}>
              {this.state.faces.map(file => (
                <GridListTile key={file} cols={1} rows={1}>
                  <img
                    src={file}
                    alt={this.props.match.params.user}
                    height={256}
                  />
                  <GridListTileBar
                    title={basename(file)}
                    titlePosition="bottom"
                    actionIcon={
                      <Tooltip title="Delete file">
                        <IconButton className={this.props.classes.icon}>
                          <IconDelete />
                        </IconButton>
                      </Tooltip>
                    }
                    actionPosition="right"
                    className={this.props.classes.titleBar}
                  />
                </GridListTile>
              ))}
              <GridListTile cols={1} rows={1}>
                <img src={imageFace} alt={'new face'} height={256} />
                <GridListTileBar
                  title={'Add face'}
                  titlePosition="bottom"
                  actionIcon={
                    <div>
                      <Tooltip title="Start camera">
                        <IconButton className={this.props.classes.icon}>
                          <IconCamera />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Upload from file">
                        <IconButton className={this.props.classes.icon}>
                          <IconUpload />
                        </IconButton>
                      </Tooltip>
                    </div>
                  }
                  actionPosition="right"
                  className={this.props.classes.titleBar}
                />
              </GridListTile>
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
