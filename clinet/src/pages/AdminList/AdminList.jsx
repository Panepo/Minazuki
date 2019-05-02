// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch, RouterHistory } from '../../models'
import * as actionPeople from '../../actions/actionPeople'
import * as actionInfo from '../../actions/actionInfo'
import type { PeopleData } from '../../models/modelPeople'
import { withRouter } from 'react-router-dom'
import Layout from '../Layout'
import { withStyles } from '@material-ui/core'
import DialogRename from './DialogRename'
import DialogDelete from './DialogDelete'
import RenderList from './RenderList'

const imageList = require('../../images/list.jpg')

const styles = (theme: Object) => ({})

type ProvidedProps = {
  classes: Object,
  history: RouterHistory,
  width: string
}

type Props = {
  classes: Object,
  peoples: PeopleData[],
  actionsP: Dispatch,
  actionsI: Dispatch
}

type State = {
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
          this.props.actionsI.infoSet({
            onoff: true,
            variant: 'success',
            message: 'User created'
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
          this.props.actionsI.infoSet({
            onoff: true,
            variant: 'success',
            message: 'User renamed'
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
        this.props.actionsI.infoSet({
          onoff: true,
          variant: 'success',
          message: 'User deleted'
        })
        break
      default:
        break
    }
  }

  toggleDialog = (target: string, onoff: boolean, name: string) => () => {
    let dialogImg = ''
    for (let i = 0; i < this.props.peoples.length; i += 1) {
      if (this.props.peoples[i].name === name) {
        if (this.props.peoples[i].files[0]) {
          dialogImg = this.props.peoples[i].files[0]
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
    return (
      <Layout
        helmet={true}
        title={'Face List | Minazuki'}
        gridNormal={10}
        gridPhone={12}
        content={
          <div>
            <RenderList
              peoples={this.props.peoples}
              handleAccept={this.handleAccept}
              handleInput={this.handleInput}
              handleInputCancel={this.handleInputCancel}
              handleEdit={this.handleEdit}
              toggleDialog={this.toggleDialog}
              newValue={this.state.inputValue.new}
            />
            <DialogRename
              dialogStatus={this.state.dialog.rename}
              username={this.state.dialogKey.rename}
              imageSrc={this.state.dialogImg}
              toggleDialog={this.toggleDialog}
              handleAccept={this.handleAccept}
              handleInput={this.handleInput}
              rename={this.state.inputValue.rename}
            />
            <DialogDelete
              dialogStatus={this.state.dialog.delete}
              username={this.state.dialogKey.delete}
              imageSrc={this.state.dialogImg}
              toggleDialog={this.toggleDialog}
              handleAccept={this.handleAccept}
            />
          </div>
        }
      />
    )
  }
}

AdminList.propTypes = {
  classes: PropTypes.object.isRequired,
  peoples: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    peoples: state.reducerPeople.peoples
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
