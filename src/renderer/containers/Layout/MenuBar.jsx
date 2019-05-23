/** @format */

import React from 'react'

import { AppBar, Toolbar, Typography } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'

import LogoIcon from '../../components/LogoIcon'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    position: 'static'
  },
  toolBar: {
    // Placement of elements inside the Toolbar.
    padding: '0px 15px 10px 15px'
  }
})

const MenuBar = props => {
  const { classes, toggle, isOpen } = props

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters={!isOpen} variant="dense" className={classes.toolBar}>
          <LogoIcon hide={isOpen} onClick={toggle} aria-label="Open Drawer">
            <Menu fontSize="small" />
          </LogoIcon>
          <Typography variant="h6" color="inherit" noWrap />
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(MenuBar)
