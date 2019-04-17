/** @format */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'

/* Styles */
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled'
import Stop from '@material-ui/icons/Stop'

import Logo from '../../images/virgo-full.svg'
import * as actionCreators from '../../store/actions'
import TimeCounter from '../../components/TimeCounter'

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center'
  },
  controlButton: {
    fontSize: '64px'
  }
})

class DashboardPage extends React.Component {
  state = {
    timeElapsed: 0,
    isRunning: false,
    _isRunning: false,
    _isPaused: false,
    _isStopped: true,
    status: '',
    showSpinner: false
  }

  definitions = [
    {
      name: 'python:slim',
      command: ['python', '-c', '"while True: pass"'],
      environment: {}
    }
    /*
    {
      name: 'mozillasecurity/libfuzzer',
      command: [],
      environment: {
        TOKENS: 'dicts/sdp.dict',
        CORPORA: 'samples/sdp/',
        FUZZER: 'SdpParser',
        LIBFUZZER_ARGS: '-use_value_profile=1 -max_total_time=180'
      },
      mount: {
        '': '~/fuzzmanagerconf'
      }
    }*/
  ]

  /* On pause */
  toggleTimer() {
    this.setState({ isRunning: !this.state.isRunning }, () => {
      this.state.isRunning ? this.startTimer() : clearInterval(this.timer)
    })
  }

  /* On stop */
  resetTimer() {
    this.setState({ isRunning: false, timeElapsed: 0 }, () => {
      clearInterval(this.timer)
    })
  }

  /* On start */
  startTimer() {
    this.startTime = Date.now()
    this.timer = setInterval(this.update, 1000)
  }

  /* During run */
  update = () => {
    const delta = Date.now() - this.startTime
    this.setState({ timeElapsed: this.state.timeElapsed + delta })
    this.startTime = Date.now()
  }

  /* During load */
  toggleSpinner = () => {
    this.setState({ showSpinner: !this.state.showSpinner })
  }

  componentDidMount() {
    this.props.setImageDefinitions(this.definitions)

    /**
     * TODO:
     * 1) Send host preferences to remote server.
     * 2) Remote sends back a task list of images suitable to run on this host.
     * 3) Host stores this list in the local state.
     * 4) Repeat with interval of N minutes, defineable in the Preference section.
     */

    /**
     *  IPC event handlers which communicate with the Docker API in the main process.
     */
    ipcRenderer.on('image.error', (event, error) => {
      this.updateStatus(`Image error: ${error.reason}`)
    })

    ipcRenderer.on('container.error', (event, error) => {
      this.updateStatus(`Container error: ${error.reason}`)
      clearInterval(this.refreshSheduler)
    })

    ipcRenderer.on('image.pull', (event, data) => {
      this.updateStatus(`Downloading task: ${data}`)
    })

    ipcRenderer.on('container.run', (event, container) => {
      this.props.setContainer(container)
      this.refreshSheduler = setInterval(() => ipcRenderer.send('container.inspect', container), 5000)
      this.updateStatus(`Task is running.`)
      this.setState({ _isRunning: true, _isPaused: false, _isStopped: false })
      this.toggleTimer()
      this.toggleSpinner()
    })

    ipcRenderer.on('container.inspect', (event, data) => {
      this.props.setContainerData(data)
    })

    ipcRenderer.on('container.stop', (event, id) => {
      this.updateStatus(`Container ${id} stopped successfully.`)
      clearInterval(this.refreshSheduler)
      this.props.setContainerData([]) && this.props.setContainer({})
      this.setState({ _isRunning: false, _isPaused: false, _isStopped: true })
      this.resetTimer()
      this.toggleSpinner()
    })

    ipcRenderer.on('container.pause', (event, id) => {
      this.updateStatus(`Container ${id} paused successfully.`)
      this.setState({ _isRunning: false, _isPaused: true, _isStopped: false })
      this.toggleTimer()
    })

    ipcRenderer.on('container.unpause', (event, id) => {
      this.updateStatus(`Container ${id} unpaused successfully.`)
      this.setState({ _isRunning: true, _isPaused: false, _isStopped: false })
      this.toggleTimer()
    })
  }

  updateStatus(text) {
    this.setState({ status: text })
  }

  containerStatus() {
    if (this.props.container !== undefined && this.props.containerData !== undefined) {
      return this.props.containerData.State.Status
    }
  }

  onStart = () => {
    if (this.props.imageDefinitions.length === 0) {
      this.updateStatus('No remote tasks available.')
      return
    }

    if (this.state._isPaused) {
      const { id } = this.props.container
      if (id) {
        this.updateStatus(`Unpausing container with ID: ${id}`)
        ipcRenderer.send('container.unpause', { id: id })
      } else {
        this.updateStatus('No container ID available.')
      }
    } else if (this.state._isStopped && !this.state._isRunning) {
      const image = this.props.imageDefinitions[0]
      this.updateStatus(`Initializing task.`)
      this.toggleSpinner()
      ipcRenderer.send('container.run', image)
    }
  }

  onStop = () => {
    const { id } = this.props.container
    if (id) {
      this.updateStatus(`Stopping container with ID: ${id}`)
      this.toggleSpinner()
      ipcRenderer.send('container.stop', { id: id })
    } else {
      this.updateStatus('No container ID available.')
    }
  }

  onPause = () => {
    const { id } = this.props.container
    if (id) {
      this.updateStatus(`Pausing container with ID: ${id}`)
      ipcRenderer.send('container.pause', { id: id })
    } else {
      this.updateStatus('No container ID available.')
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={40}>
          <Grid item xs={12}>
            <img src={Logo} alt="Virgo" />
          </Grid>
          <Grid item xs={12}>
            {this.state._isRunning || this.state._isPaused ? (
              <Typography color="textPrimary" variant="h3">
                <TimeCounter timeElapsed={this.state.timeElapsed} />
              </Typography>
            ) : (
              <Typography color="textPrimary" variant="body1">
                {this.props.imageDefinitions.length} Tasks available.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="center">
              <Grid item>
                {!this.state._isRunning || this.state._isStopped || this.state._isPaused ? (
                  <IconButton onClick={this.onStart}>
                    <PlayCircleFilled className={classes.controlButton} />
                  </IconButton>
                ) : (
                  <IconButton onClick={this.onPause}>
                    <PauseCircleFilled className={classes.controlButton} />
                  </IconButton>
                )}
              </Grid>
              <Grid item>
                {this.state._isRunning || this.state._isPaused ? (
                  <IconButton onClick={this.onStop}>
                    <Stop className={classes.controlButton} />
                  </IconButton>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {this.state.showSpinner ? <CircularProgress className={classes.progress} /> : null}
          </Grid>
          <Grid item xs={12}>
            <Typography color="textPrimary" variant="body2">
              {this.state.status}
            </Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}

/* PropTypes */
DashboardPage.propTypes = {
  classes: PropTypes.object.isRequired,
  setImageDefinitions: PropTypes.func.isRequired,
  setImageError: PropTypes.func.isRequired,
  setContainerError: PropTypes.func.isRequired,
  imageDefinitions: PropTypes.array.isRequired,
  setContainer: PropTypes.func.isRequired,
  setContainerData: PropTypes.func.isRequired,
  container: PropTypes.object,
  containerData: PropTypes.object,
  imageError: PropTypes.object,
  containerError: PropTypes.object
}

/* States */
const mapStateToProps = state => {
  return {
    imageDefinitions: state.imageDefinitions,
    imageError: state.imageError,
    containerError: state.containerError,
    containerData: state.containerData,
    container: state.container
  }
}

/* Dispatchers */
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setImageDefinitions: actionCreators.setImageDefinitions,
      setImageError: actionCreators.setImageError,
      setContainerError: actionCreators.setContainerError,
      setContainerData: actionCreators.setContainerData,
      setContainer: actionCreators.setContainer
    },
    dispatch
  )
}

/* Connect map's to Container */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DashboardPage))
