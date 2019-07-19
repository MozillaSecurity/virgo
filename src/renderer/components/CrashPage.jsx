/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Logger from '../../shared/logger'

const logger = new Logger('CrashPage')

const styles = theme => ({
  root: {
    backgroundColor: '#2b2c38',
    padding: '10%',
    height: '100%',
    margin: 0
  },
  button: {
    justifyContent: 'center'
  },
  grid: {
    paddingTop: '100px'
  },
  text: {
    color: '#ffffff'
  }
})

const Preferences = props => <Link to={'/preferences'} {...props} />
const Dashboard = props => <Link to={'/dashboard'} {...props} />

class CrashPage extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography variant="h1" color="secondary">
          Crashed :-/
        </Typography>
        <Typography variant="body2" className={classes.text}>
          The error has been sent to us.
        </Typography>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={8}
          className={classes.grid}
        >
          <Grid item xs align="center">
            <Button variant="contained" color="primary" component={Preferences}>
              Preferences
            </Button>
          </Grid>
          <Grid item xs align="center">
            <Button variant="contained" color="primary" component={Dashboard}>
              Dashboard
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

CrashPage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(CrashPage)
