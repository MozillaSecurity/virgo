/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/* Styles */
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled'
import Stop from '@material-ui/icons/Stop'
import { withStyles } from '@material-ui/core/styles'

/* Custom UI */
import TimeCounter from '../../components/TimeCounter'

const styles = theme => ({
  controlButton: {
    fontSize: '64px'
  }
})

const STOPPED = -1
const RUNNING = 0
const PAUSED = 1

class RunTimer extends React.Component {
  getInitialState() {
    // status, needs to be in redux
    return {
      state: STOPPED,
      delta: 0,
      elapsed: 0,
      start: 0,
      handle: -1
    }
  }

  state = this.getInitialState()

  componentDidMount() {
    const { elapsed, setStatus } = this.props

    setStatus({ elapsed })
  }

  onStart = () => {
    const { startCallback, setStatus, status } = this.props

    /* Trigger Qualifications */
    if (status.state === STOPPED) {
      startCallback()
      setStatus({
        start: Date.now(),
        handle: setInterval(this.update, 1000),
        state: RUNNING
      })
    }
  }

  onStop = () => {
    const { stopCallback, setStatus, status } = this.props

    /* Trigger Qualifications */
    if (status.state === RUNNING || status.state === PAUSED) {
      stopCallback()
      clearInterval(status.handle)
      setStatus({ ...this.getInitialState() }) // 1) save elpased to redux?
    }
  }

  onPause = () => {
    const { pauseCallback, setStatus, status } = this.props

    /* Trigger Qualifications */
    if (status.state === RUNNING) {
      pauseCallback()
      clearInterval(status.handle)
      setStatus({
        state: PAUSED,
        elapsed: status.delta // 1) save elapsed to redux?
      })
    }
  }

  onResume = () => {
    const { resumeCallback, setStatus, status } = this.props

    /* Trigger Qualifications */
    if (status.state === PAUSED) {
      resumeCallback()
      setStatus({
        start: Date.now(),
        handle: setInterval(this.update, 1000),
        state: RUNNING
      })
    }
  }

  update = () => {
    const { setStatus, status } = this.props

    setStatus({
      delta: Date.now() - status.start + status.elapsed // 2) ... or write delta to redux on every interval?
    })
  }

  componentUnmount() {
    const { status } = this.props

    clearInterval(status.handle)
    // 1) save elpased to redux?
  }

  render() {
    const { classes, status } = this.props

    const isStopped = status.state === STOPPED
    const isRunning = status.state === RUNNING
    const isPaused = status.state === PAUSED

    return (
      <React.Fragment>
        <Grid item xs={12}>
          {isRunning || isPaused ? (
            <Typography color="textPrimary" variant="h3">
              <TimeCounter timeElapsed={status.delta} />
            </Typography>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={8} justify="center">
            <Grid item>
              {isStopped ? (
                <IconButton onClick={this.onStart}>
                  <PlayCircleFilled className={classes.controlButton} />
                </IconButton>
              ) : null}

              {isPaused ? (
                <IconButton onClick={this.onResume}>
                  <PlayCircleFilled className={classes.controlButton} />
                </IconButton>
              ) : null}

              {isRunning ? (
                <IconButton onClick={this.onPause}>
                  <PauseCircleFilled className={classes.controlButton} />
                </IconButton>
              ) : null}
            </Grid>
            <Grid item>
              {isRunning || isPaused ? (
                <IconButton onClick={this.onStop}>
                  <Stop className={classes.controlButton} />
                </IconButton>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

RunTimer.propTypes = {
  classes: PropTypes.object.isRequired,
  stopCallback: PropTypes.func.isRequired,
  startCallback: PropTypes.func.isRequired,
  pauseCallback: PropTypes.func.isRequired,
  resumeCallback: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RunTimer))
