// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionFace from '../../actions/actionFace'
import * as actionInfo from '../../actions/actionInfo'
import type { StateFace } from '../../models/modelFace'
import Layout from '../Layout'
import { withRouter } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { withStyles } from '@material-ui/core/styles'

const styles = (theme: Object) => ({
  paper: {
    borderRadius: '2px',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '40px',
    paddingRight: '40px'
  },
})

type ProvidedProps = {
  classes: Object,
  match: any,
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

  renderFaceList() {
    return this.state.faces.reduce((output, data, i) => {
      output.push(
        <Grid item={true} xs={2} key={'faceCard' + i.toString()}>
          <Card className={this.props.classes.card}>
            <img
              className={this.props.classes.media}
              src={"../" + data}
              alt={"FQ"}
            />
            <CardActions>
              <Button
                size="small"
                color="primary">
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )
      return output
    }, [])
  }

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
        title={'Face List | Minazuki'}
        gridNormal={10}
        gridPhone={12}
        content={
          <div>
            <Grid
              container={true}
              className={this.props.classes.grid}
              spacing={16}>
              {this.renderFaceList()}
            </Grid>
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

