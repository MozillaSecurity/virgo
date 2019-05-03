/** @format */

import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

/* Styles */
import { Drawer, AppBar, Toolbar } from '@material-ui/core'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Menu from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'

/* Custom UI */
import LogoIcon from '../../components/LogoIcon'
import DarkmodeSwitch from '../../components/DarkmodeSwitch'

import * as actionCreators from '../../store/actions'

const styles = theme => ({
  appBar: {
    padding: '10px 15px 0px 15px'
  },
  toolBar: {},
  icon: {
    padding: '8px'
  },
  titleBar: {
    width: '100%',
    height: '30px',
    userSelect: 'none',
    appRegion: 'drag',
    position: 'fixed'
  },
  drawerPaper: {
    position: 'relative',
    width: 240,
    background:
      theme.palette.type === 'dark' && theme.palette.background === 'transparent' ? 'rgba(40, 44, 52, 0.8)' : null
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    // To equal the height of appBar/toolBar.
    height: '74px',
    justifyContent: 'flex-end',
    padding: '10px 10px 0px 0px',
    ...theme.mixins.Toolbar
  },
  statusBar: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    rounded: false
  },
  drawerFooter: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
  content: {
    flexGrow: 1,
    padding: '100px 50px 100px 50px'
  }
})

const SideDrawer = props => {
  const { classes, children, items, toggleDarkMode, darkMode } = props

  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => setIsOpen(!isOpen)

  const brand = (
    <div className={classes.drawerHeader}>
      <IconButton onClick={toggleDrawer} className={classes.icon} aria-label="Close Drawer">
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
    </div>
  )

  const drawer = (
    <Drawer
      variant="temporary"
      anchor="left"
      open={isOpen}
      classes={{ paper: classes.drawerPaper }}
      ModalProps={{ onBackdropClick: toggleDrawer }}
    >
      {brand}
      <div onClick={toggleDrawer}>{items}</div>
      <div className={classes.drawerFooter}>
        <List>
          <DarkmodeSwitch onChange={toggleDarkMode} checked={darkMode} />
        </List>
      </div>
    </Drawer>
  )

  const appbar = (
    <AppBar className={classes.appBar}>
      <Toolbar disableGutters={!isOpen} className={classes.toolBar}>
        <LogoIcon hide={isOpen} onClick={toggleDrawer} aria-label="Open Drawer">
          <Menu fontSize="small" />
        </LogoIcon>
        <Typography variant="h6" color="inherit" noWrap />
      </Toolbar>
    </AppBar>
  )

  return (
    <div>
      <div className={classes.titleBar} />
      {appbar}
      {drawer}
      <main className={classes.content}>{children}</main>
    </div>
  )
}

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    darkMode: state.preferences.darkMode
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleDarkMode: actionCreators.toggleDarkMode
    },
    dispatch
  )
}

// Blocked Updates: https://bit.ly/2DajltC
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles, { withTheme: true })(SideDrawer))
)
