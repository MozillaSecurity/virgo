/** @format */
import React from 'react'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  titleBar: {
    width: '100%',
    height: '25px',
    userSelect: 'none',
    appRegion: 'drag',
    position: 'static'
  }
})

const TitleBar = props => {
  const { classes } = props

  return (
    <div className={classes.root}>
      <div name="TitleBar" className={classes.titleBar} />
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(TitleBar)
