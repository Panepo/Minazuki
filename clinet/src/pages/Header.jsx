// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Dispatch } from '../models'
import * as actionAuth from '../actions/actionAuth'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import IconBookmark from '@material-ui/icons/Bookmarks'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'
import { linkDrawer, linkHeader } from '../constants/constLink'
import type { LinkSite } from '../models/modelMisc'

const styles = (theme: Object) => ({
  root: {},
  appBar: {
    position: 'relative'
  },
  button: {
    margin: theme.spacing.unit
  },
  drawer: {
    color: '#616161'
  },
  drawerTitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    color: '#0066ff',
    marginLeft: -12,
    marginRight: 20
  },
  avatar: {
    color: '#fff',
    backgroundColor: green[500]
  },
  avatarAdmin: {
    color: '#fff',
    backgroundColor: blue[500]
  }
})

type ProvidedProps = {
  classes: Object,
  auth: Object,
  actionA: Dispatch
}

type Props = {
  classes: Object,
  auth: Object,
  actionA: Dispatch
}

type State = {
  drawer: boolean
}

class Header extends React.Component<ProvidedProps & Props, State> {
  state = {
    drawer: false
  }

  toggleDrawer = (side: string, open: boolean) => () => {
    this.setState({
      [side]: open
    })
  }

  handleLogout = () => {
    this.props.actionA.logoutUser()
  }

  renderAvatar = () => {
    if (this.props.auth.isAuthenticated) {
      if (this.props.auth.user.admin) {
        return (
          <Button onClick={this.handleLogout}>
            <Avatar className={this.props.classes.avatarAdmin}>
              {this.props.auth.user.name.substr(0, 1).toUpperCase()}
            </Avatar>
          </Button>
        )
      } else {
        return (
          <Button onClick={this.handleLogout}>
            <Avatar className={this.props.classes.avatar}>
              {this.props.auth.user.name.substr(0, 1).toUpperCase()}
            </Avatar>
          </Button>
        )
      }
    }
  }

  render() {
    const { classes } = this.props

    const renderLink = linkHeader.map((data: Link) => (
      <Link to={data.link} key={data.text}>
        <Button color="primary">{data.text}</Button>
      </Link>
    ))

    const renderDrawer = (
      <List>
        {linkDrawer.map((data: LinkSite) => (
          <ListItem
            button
            divider
            key={data.text}
            component="a"
            href={data.link}>
            <ListItemIcon>
              <IconBookmark color="secondary" />
            </ListItemIcon>
            <ListItemText primary={data.text} />
          </ListItem>
        ))}
      </List>
    )

    return (
      <header className={classes.root}>
        <AppBar position="static" color="inherit" className={classes.appBar}>
          <Drawer
            className={classes.drawer}
            open={this.state.drawer}
            onClose={this.toggleDrawer('drawer', false)}>
            <Typography
              className={classes.drawerTitle}
              variant="h6"
              color="inherit"
              noWrap>
              Reference
            </Typography>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer('drawer', false)}
              onKeyDown={this.toggleDrawer('drawer', false)}>
              {renderDrawer}
            </div>
          </Drawer>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer('drawer', true)}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.grow}
              noWrap>
              Minazuki
            </Typography>
            {this.renderAvatar()}
            {renderLink}
          </Toolbar>
        </AppBar>
      </header>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.reducerAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actionA: bindActionCreators(actionAuth, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header))
