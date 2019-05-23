/** @format */

import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Paper, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
    bottom: 0,
    width: '100%',
    position: 'fixed'
  },
  content: {
    padding: '4px 10px 4px 10px',
    height: '28px',
    background: theme.statusBar.background
  }
})

const StatusBar = props => {
  const { classes, docker } = props
  // NOTE: https://material-ui.com/layout/grid/#negative-margin
  return (
    <div className={classes.root}>
      <Grid container spacing={0} justify="space-between" alignItems="flex-end">
        <Grid item xs={10}>
          <Paper square className={classes.content}>
            <Typography color="textPrimary" variant="body2">
              {docker.status.text}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper square className={classes.content}>
            <Typography color="textPrimary" variant="body2">
              {docker.definitions.length} Tasks
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

StatusBar.propTypes = {
  classes: PropTypes.object.isRequired,
  docker: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(StatusBar)
