/** @format */

import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

/* Styles */
import { Drawer, List, ListItem, IconButton } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { withStyles } from '@material-ui/core/styles'

/* Custom UI */
import DarkmodeSwitch from '../../components/DarkmodeSwitch'
import MenuBar from './MenuBar'
import StatusBar from './StatusBar'
import TitleBar from './TitleBar'

import * as actionCreators from '../../store/actions'

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100% !important',
    overflow: 'hidden',
    height: '100%',
    margin: 0
  },
  content: {
    flexGrow: 1,
    // Plus 5px padding-top cause drop-shadow gets cut by AppBar.
    padding: '5px 15px 30px 15px',
    height: '85%',
    overflow: 'auto',
    background: theme.palette.background.default
  },
  icon: {
    padding: '8px'
  },
  drawerPaper: {
    position: 'relative',
    width: 240,
    background: theme.drawer.background
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    // Equal the height of the AppBar + TitleBar.
    height: '74px',
    justifyContent: 'flex-end',
    padding: '0px 10px 10px 0px',
    ...theme.mixins.Toolbar
  },
  drawerFooter: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  }
})

const Content = props => {
  const { classes, children } = props
  return <div className={classes.content}>{children}</div>
}

const SideDrawer = props => {
  const { classes, items, toggleDarkMode, darkMode } = props

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
          <ListItem>
            <DarkmodeSwitch onChange={toggleDarkMode} checked={darkMode} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  )

  return (
    <div className={classes.root}>
      <TitleBar />
      <MenuBar toggle={toggleDrawer} isOpen={isOpen} />
      {drawer}
      <Content {...props} />
      <StatusBar docker={props.docker} />
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
    darkMode: state.preferences.darkMode,
    status: state.docker.status,
    docker: state.docker
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
