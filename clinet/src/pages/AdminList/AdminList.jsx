// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Layout from '../Layout'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
// import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import CardFaceData from '../../componments/CardFaceData'

const styles = (theme: Object) => ({})

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object
}

type State = {
  isLoading: boolean,
  snackStatus: boolean,
  snackType: string,
  snackMessage: string,
  data: any | null
}

class AdminList extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    snackStatus: false,
    snackType: '',
    snackMessage: '',
    data: null
  }

  componentDidMount = async () => {
    await this.dataBaseGetData()
    this.setState({ isLoading: false })
  }

  dataBaseGetData = () => {
    axios
      .get('/data/getData')
      .then(res => {
        this.setState({
          data: res.data.data
        })
      })
      .catch(err => {
        this.setState({
          snackStatus: true,
          snackType: 'error',
          snackMessage: err.response.data
        })
      })
  }

  handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ snackStatus: false })
  }

  renderFaceList = () => {
    if (this.state.data) {
      return this.state.data.reduce((output, data, i) => {
        output.push(
          <Grid item={true} xs={4} key={'faceCard' + i.toString()}>
            <CardFaceData faceData={data} />
          </Grid>
        )
        return output
      }, [])
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Layout
          helmet={true}
          title={'Face List | Minazuki'}
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
        helmet={true}
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

AdminList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AdminList)
