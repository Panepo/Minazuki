// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch, RouterHistory } from '../../models'
import * as actionPeople from '../../actions/actionPeople'
import * as actionInfo from '../../actions/actionInfo'
import type { StatePeople, PeopleData } from '../../models/modelPeople'
import { withRouter } from 'react-router-dom'
import Layout from '../Layout'
import { withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const imageList = require('../../images/list.jpg')
const imageList2 = require('../../images/list2.jpg')

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
  },
  card: {
    height: 300
  },
  dialog: {
    width: 300
  }
})

type ProvidedProps = {
  classes: Object,
  history: RouterHistory
}

type Props = {
  classes: Object,
  people: StatePeople,
  actionsP: Dispatch,
  actionsI: Dispatch
}

type State = {
  isLoading: boolean,
  peoples: PeopleData[],
  dialog: {
    rename: boolean,
    delete: boolean
  },
  dialogKey: {
    rename: string,
    delete: string
  },
  dialogImg: any | null,
  inputValue: {
    rename: string,
    new: string
  }
}

class AdminList extends React.Component<ProvidedProps & Props, State> {
  state = {
    isLoading: true,
    peoples: [],
    dialog: {
      rename: false,
      delete: false
    },
    dialogKey: {
      rename: '',
      delete: ''
    },
    dialogImg: null,
    inputValue: {
      rename: '',
      new: ''
    }
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

  // ================================================================================
  // React event handler functions
  // ================================================================================
  handleInput = (target: string) => (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    this.setState({
      inputValue: {
        ...this.state.inputValue,
        [target]: (event.target: window.HTMLInputElement).value
      }
    })
  }

  handleInputCancel = (target: string) => () => {
    this.setState({ inputValue: { ...this.state.inputValue, [target]: '' } })
  }

  handleAccept = (target: string) => () => {
    switch (target) {
      case 'new':
        this.props.actionsP.peopleAdd({ name: this.state.inputValue.new })
        break
      case 'rename':
        this.props.actionsP.peopleRename({
          name: this.state.dialogKey.rename,
          newName: this.state.inputValue.rename
        })
        break
      case 'delete':
        this.props.actionsP.peopleDelete({ name: this.state.dialogKey.delete })
        break
      default:
        break
    }
    this.setState({
      dialog: { ...this.state.dialog, [target]: false }
    })
  }

  toggleDialog = (target: string, onoff: boolean, name: string) => () => {
    let dialogImg = ''
    for (let i = 0; i < this.state.peoples.length; i += 1) {
      if (this.state.peoples[i].name === name) {
        if (this.state.peoples[i].files[0]) {
          dialogImg = this.state.peoples[i].files[0]
        } else {
          dialogImg = imageList
        }
      }
    }

    this.setState({
      dialog: { ...this.state.dialog, [target]: onoff },
      dialogKey: { ...this.state.dialogKey, [target]: name },
      dialogImg: dialogImg
    })
  }

  handleEdit = (name: string) => () => {
    this.props.history.push('/list/' + name)
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderFaceList() {
    return this.state.peoples.reduce((output, data, i) => {
      output.push(
        <Grid item={true} xs={2} key={'faceCard' + i.toString()}>
          <Card className={this.props.classes.card}>
            <CardMedia
              className={this.props.classes.media}
              image={data.files[0] ? data.files[0] : imageList}
              title={data.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {data.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={this.handleEdit(data.name)}>
                Edit
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={this.toggleDialog('rename', true, data.name)}>
                Rename
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={this.toggleDialog('delete', true, data.name)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )
      return output
    }, [])
  }

  renderAdd() {
    return (
      <Grid item={true} xs={2} key={'addfaceCard'}>
        <Card className={this.props.classes.card}>
          <img src={imageList2} alt={'add face'} height={140} />
          <CardContent>
            <TextField
              label={'Enter name'}
              className={this.props.classes.formControl}
              value={this.state.inputValue.new}
              onInput={this.handleInput('new')}
              margin="normal"
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={this.handleAccept('new')}>
              Add
            </Button>
            <Button
              size="small"
              color="secondary"
              onClick={this.handleInputCancel('new')}>
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  render() {
    const renderDialogRename = (
      <Dialog
        open={this.state.dialog.rename}
        onClose={this.toggleDialog('rename', false, '')}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'xl'}>
        <DialogTitle id="select-dialog-title">User Rename</DialogTitle>
        <DialogContent>
          <CardMedia
            className={this.props.classes.media}
            image={this.state.dialogImg}
            title={'rename'}
          />
          <TextField
            autoFocus
            label="Enter Name"
            value={this.state.inputValue.rename}
            margin="dense"
            fullWidth
            onInput={this.handleInput('rename')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleAccept('rename')} color="primary">
            Accept
          </Button>
          <Button
            onClick={this.toggleDialog('rename', false, '')}
            color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )

    const renderDialogDelete = (
      <Dialog
        open={this.state.dialog.delete}
        onClose={this.toggleDialog('delete', false, '')}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'xl'}>
        <DialogTitle id="select-dialog-title">User Delete</DialogTitle>
        <DialogContent>
          <CardMedia
            className={this.props.classes.media}
            image={this.state.dialogImg}
            title={'delete'}
          />
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
              {this.renderAdd()}
            </Grid>
            {renderDialogRename}
            {renderDialogDelete}
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
    actionsP: bindActionCreators(actionPeople, dispatch),
    actionsI: bindActionCreators(actionInfo, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(AdminList)))
