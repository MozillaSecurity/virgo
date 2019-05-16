/** @format */
import React from 'react'

import { AppBar, Toolbar, Typography } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'

import LogoIcon from '../../components/LogoIcon'

const styles = theme => ({
  root: {
    padding: '10px 15px 0px 15px'
  }
})

const MenuBar = props => {
  const { classes, toggle, isOpen } = props
  return (
    <AppBar className={classes.root}>
      <Toolbar disableGutters={!isOpen}>
        <LogoIcon hide={isOpen} onClick={toggle} aria-label="Open Drawer">
          <Menu fontSize="small" />
        </LogoIcon>
        <Typography variant="h6" color="inherit" noWrap />
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles, { withTheme: true })(MenuBar)
