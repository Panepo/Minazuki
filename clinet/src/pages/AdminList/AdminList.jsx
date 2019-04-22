// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../../models'
import * as actionPeople from '../../actions/actionPeople'
import type { StatePeople, PeopleData } from '../../models/modelPeople'
import Layout from '../Layout'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

const styles = (theme: Object) => ({
  paper: {
    borderRadius: '2px',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '40px',
    paddingRight: '40px'
  },
  media: {
    height: 140
  }
})

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  people: StatePeople,
  actionsP: Dispatch
}

type State = {
  isLoading: boolean,
  peoples: PeopleData[]
}

class AdminList extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    peoples: []
  }

  componentDidMount = async () => {
    await this.props.actionsP.peopleGetAll()
    this.setState({ isLoading: false })
  }

  static getDerivedStateFromProps(nextProps: ProvidedProps & Props) {
    if (nextProps.people.peoples) {
      return { peoples: nextProps.people.peoples }
    } else return null
  }

  renderFaceList() {
    return this.state.peoples.reduce((output, data, i) => {
      output.push(
        <Grid item={true} xs={2} key={'faceCard' + i.toString()}>
          <Card>
            <CardMedia
              className={this.props.classes.media}
              image={data.files[0]}
              title={data.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {data.name}
              </Typography>
              <Typography component="p">
                Lizards are a widespread group of squamate reptiles, with over
                6,000 species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
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
  classes: PropTypes.object.isRequired,
  people: PropTypes.shape({
    peoples: PropTypes.array,
    errors: PropTypes.string
  })
}

const mapStateToProps = state => {
  return {
    people: state.reducerPeople
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionsP: bindActionCreators(actionPeople, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminList))
