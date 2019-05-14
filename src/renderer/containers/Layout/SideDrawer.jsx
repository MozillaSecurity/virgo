/** @format */

import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

/* Styles */
import { Drawer, AppBar, Toolbar } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Menu from '@material-ui/icons/Menu'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
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
    background: theme.drawer.background
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
  drawerFooter: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
  content: {
    flexGrow: 1,
    padding: '75px 15px 0px 15px',
    height: '100%',
    background: theme.palette.background.default
  },
  statusBar: {
    width: '100%',
    background: theme.statusBar.background,
    padding: '4px 10px 4px 10px',
    position: 'fixed',
    height: '28px',
    bottom: 0
  }
})

const SideDrawer = props => {
  const { classes, children, items, toggleDarkMode, darkMode, docker } = props

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

  const statusBar = (
    <div>
      <Grid container spacing={24}>
        <Grid item xs={10}>
          <Paper className={classes.statusBar} square>
            <Typography color="textPrimary" variant="body2">
              {docker.status.text}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.statusBar} sqaure>
            <Typography color="textPrimary" variant="body2">
              {docker.definitions.length} Tasks
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )

  return (
    <div>
      <div className={classes.titleBar} />
      {appbar}
      {drawer}
      <main className={classes.content}>{children}</main>
      {statusBar}
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
