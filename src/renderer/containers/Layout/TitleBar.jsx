/** @format */
import React from 'react'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: '100%',
    height: '30px',
    userSelect: 'none',
    appRegion: 'drag',
    position: 'fixed'
  }
})

const TitleBar = props => {
  const { classes } = props

  return <div className={classes.root} />
}

export default withStyles(styles, { withTheme: true })(TitleBar)
