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
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import IconContent from '@material-ui/icons/Person'
import IconDelete from '@material-ui/icons/Delete'
import IconRename from '@material-ui/icons/Description'
import IconAdd from '@material-ui/icons/PersonAdd'
import IconCancel from '@material-ui/icons/Cancel'
import Grid from '@material-ui/core/Grid'

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
  gridList: {
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  }
})

type ProvidedProps = {
  classes: Object,
  history: RouterHistory,
  width: string
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

  handleAccept = (target: string) => (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    event.preventDefault()
    switch (target) {
      case 'new':
        if (this.state.inputValue.new.length > 0) {
          this.props.actionsP.peopleAdd({ name: this.state.inputValue.new })
          this.setState({
            dialog: { ...this.state.dialog, [target]: false }
          })
        } else {
          this.props.actionsI.infoSet({
            onoff: true,
            variant: 'error',
            message: 'Invalid inputs'
          })
        }
        break
      case 'rename':
        if (this.state.inputValue.rename.length > 0) {
          this.props.actionsP.peopleRename({
            name: this.state.dialogKey.rename,
            newName: this.state.inputValue.rename
          })
          this.setState({
            dialog: { ...this.state.dialog, [target]: false }
          })
        } else {
          this.props.actionsI.infoSet({
            onoff: true,
            variant: 'error',
            message: 'Invalid inputs'
          })
        }
        break
      case 'delete':
        this.props.actionsP.peopleDelete({ name: this.state.dialogKey.delete })
        this.setState({
          dialog: { ...this.state.dialog, [target]: false }
        })
        break
      default:
        break
    }
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

  render() {
    const renderDialogRename = (
      <Dialog
        open={this.state.dialog.rename}
        onClose={this.toggleDialog('rename', false, '')}
        aria-labelledby="select-dialog-title"
        aria-describedby="select-dialog-description"
        maxWidth={'xl'}>
        <DialogTitle id="select-dialog-title">Rename</DialogTitle>
        <DialogContent>
          <div>
            <img src={this.state.dialogImg} alt={'rename'} width={300} />
          </div>
          <div>
            <Typography gutterBottom variant="h5" component="h2">
              {this.state.dialogKey.rename}
            </Typography>
          </div>
          <div>
            <TextField
              autoFocus
              label="Enter Name"
              value={this.state.inputValue.rename}
              margin="dense"
              fullWidth
              onInput={this.handleInput('rename')}
            />
          </div>
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
        <DialogTitle id="select-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <div>
            <img src={this.state.dialogImg} alt={'delete'} width={300} />
          </div>
          <Typography gutterBottom variant="h5" component="h2">
            {this.state.dialogKey.delete}
          </Typography>
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

    const renderList = this.state.peoples.map(data => (
      <Grid item={true} xs={2} key={data.name}>
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
            <Typography component="p">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
          <CardActions>
            <Tooltip title="Content">
              <IconButton color="primary" onClick={this.handleEdit(data.name)}>
                <IconContent />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rename">
              <IconButton
                color="primary"
                onClick={this.toggleDialog('rename', true, data.name)}>
                <IconRename />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="primary"
                onClick={this.toggleDialog('delete', true, data.name)}>
                <IconDelete />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    ))

    const renderAdd = (
      <Grid item={true} xs={2} key={'addfaceCard'}>
        <Card className={this.props.classes.card}>
          <img src={imageList2} alt={'add face'} height={140} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Add
            </Typography>
            <TextField
              label={'Enter name'}
              className={this.props.classes.formControl}
              value={this.state.inputValue.new}
              onInput={this.handleInput('new')}
              margin="normal"
            />
          </CardContent>
          <CardActions>
            <Tooltip title="Add">
              <IconButton color="primary" onClick={this.handleAccept('new')}>
                <IconAdd />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                color="primary"
                onClick={this.handleInputCancel('new')}>
                <IconCancel />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
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
              {renderList}
              {renderAdd}
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
