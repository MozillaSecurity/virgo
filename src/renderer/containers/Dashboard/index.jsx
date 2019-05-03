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
import IconButton from '@material-ui/core/IconButton'
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled'
import Stop from '@material-ui/icons/Stop'
import { withStyles } from '@material-ui/core/styles'

/* Custom UI */
import axios from 'axios'
import Logo from '../../images/virgo-full.svg'
import * as actionCreators from '../../store/actions'
import TimeCounter from '../../components/TimeCounter'

// eslint-disable-next-line no-unused-vars
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
  async componentDidMount() {
    await this.fetchTaskDefinitions()

    /* IPC event handlers which communicate with the Docker API in the main process. */
    ipcRenderer.on('image.pull', (event, data) => this.pullImage(event, data))
    ipcRenderer.on('container.run', (event, data) => this.runContainer(event, data))
    ipcRenderer.on('container.inspect', (event, data) => this.inspectContainer(event, data))
    ipcRenderer.on('container.stop', (event, data) => this.stopContainer(event, data))
    ipcRenderer.on('container.pause', (event, data) => this.pauseContainer(event, data))
    ipcRenderer.on('container.unpause', (event, data) => this.unpauseContainer(event, data))
    ipcRenderer.on('image.error', (event, data) => this.imageError(event, data))
    ipcRenderer.on('container.error', (event, data) => this.containerError(event, data))
  }

  pullImage = (event, data) => {
    this.props.setStatus({ text: `Downloading task: ${data}` })
  }

  runContainer = (event, container) => {
    this.props.setContainer(container)
    this.refreshSheduler = setInterval(() => ipcRenderer.send('container.inspect', container), 10000)
    this.props.setStatus({ text: `Task is running`, state: 0 })
    this.toggleTimer()
    this.toggleSpinner()
  }

  inspectContainer = (event, data) => {
    this.props.setContainerData(data)
  }

  stopContainer = (event, id) => {
    clearInterval(this.refreshSheduler)
    this.props.setContainerData([])
    this.props.setContainer({})
    this.props.setStatus({ text: `Container ${id} stopped successfully.`, state: 2 })
    this.resetTimer()
    this.toggleSpinner()
  }

  pauseContainer = (event, id) => {
    this.props.setStatus({ text: `Container ${id} paused successfully.`, state: 1 })
    this.toggleTimer()
  }

  unpauseContainer = (event, id) => {
    this.props.setStatus({ text: `Container ${id} unpaused successfully.`, state: 0 })
    this.toggleTimer()
  }

  imageError = (event, error) => {
    this.props.setStatus({ text: `Image error: ${error.reason}` })
  }

  containerError = (event, error) => {
    this.props.setStatus({ text: `Container error: ${error.reason}` })
    clearInterval(this.refreshSheduler)
  }

  onStart = () => {
    const { imageDefinitions, container, setStatus, status } = this.props

    if (imageDefinitions.length === 0) {
      setStatus({ text: 'No remote tasks available.' })
      return
    }

    if (status.state === 1) {
      const { id } = container
      if (id) {
        setStatus({ text: `Unpausing container with ID: ${id}` })
        ipcRenderer.send('container.unpause', { id })
      } else {
        setStatus({ text: `No container ID available.` })
      }
    } else if (status.state === 2 || status.state !== 0) {
      const image = imageDefinitions[0]
      setStatus({ text: `Initializing task.` })
      this.toggleSpinner()
      ipcRenderer.send('container.run', image)
    }
  }

  onStop = () => {
    const { container, setStatus } = this.props
    const { id } = container
    if (id) {
      setStatus({ text: `Stopping container with ID: ${id}` })
      this.toggleSpinner()
      ipcRenderer.send('container.stop', { id })
    } else {
      setStatus({ text: `No container ID available.` })
    }
  }

  onPause = () => {
    const { container, setStatus } = this.props
    const { id } = container
    if (id) {
      setStatus({ text: `Pausing container with ID: ${id}` })
      ipcRenderer.send('container.pause', { id })
    } else {
      setStatus({ text: `No container ID available.` })
    }
  }

  /* During load */
  toggleSpinner = () => {
    this.props.setStatus({ showSpinner: !this.props.status.showSpinner })
  }

  /* During run */
  update = () => {
    const delta = Date.now() - this.props.status.startTime
    this.props.setStatus({ timeElapsed: this.props.status.timeElapsed + delta, startTime: Date.now() })
  }

  /* On pause */
  toggleTimer() {
    this.props.status.state == 0 ? this.startTimer() : clearInterval(this.timer)
  }

  /* On start */
  startTimer() {
    this.props.setStatus({ startTime: Date.now() })
    this.timer = setInterval(this.update, 1000)
  }

  /* On stop */
  resetTimer() {
    this.props.setStatus({ state: -1, timeElapsed: 0 })
    clearInterval(this.timer)
  }

  containerStatus() {
    const { container, containerData } = this.props
    if (container !== undefined && containerData !== undefined) {
      return containerData.State.Status
    }
  }

  fetchTaskDefinitions() {
    const { taskURL, setImageDefinitions } = this.props
    axios
      .get(taskURL)
      .then(response => {
        setImageDefinitions(response.data)
      })
      .catch(error => {
        console.log(error)
        console.log('error fetching task definitions')
      })
  }

  render() {
    const { classes, imageDefinitions, status } = this.props

    const isRunning = status.state === 0
    const isPaused = status.state === 1
    const isStopped = status.state === 2

    return (
      <div className={classes.root}>
        <Grid container spacing={40}>
          <Grid item xs={12}>
            <img src={Logo} alt="Virgo" />
          </Grid>
          <Grid item xs={12}>
            {isRunning || isPaused ? (
              <Typography color="textPrimary" variant="h3">
                <TimeCounter timeElapsed={status.timeElapsed} />
              </Typography>
            ) : (
              <Typography color="textPrimary" variant="body1">
                {imageDefinitions.length} Tasks available.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="center">
              <Grid item>
                {!isRunning || isStopped || isPaused ? (
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
                {isRunning || isPaused ? (
                  <IconButton onClick={this.onStop}>
                    <Stop className={classes.controlButton} />
                  </IconButton>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {status.showSpinner ? <CircularProgress className={classes.progress} /> : null}
          </Grid>
          <Grid item xs={12}>
            <Typography color="textPrimary" variant="body2">
              {status.text}
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
  // imageDefinitions: PropTypes.array.isRequired,
  setContainer: PropTypes.func.isRequired,
  setContainerData: PropTypes.func.isRequired,
  container: PropTypes.object,
  containerData: PropTypes.any,
  imageError: PropTypes.object,
  containerError: PropTypes.object,
  taskURL: PropTypes.string.isRequired
}

/* States */
const mapStateToProps = state => {
  return {
    imageDefinitions: state.docker.imageDefinitions,
    imageError: state.docker.imageError,
    containerError: state.docker.containerError,
    containerData: state.docker.containerData,
    container: state.docker.container,
    taskURL: state.preferences.taskURL,
    status: state.docker.status
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
      setContainer: actionCreators.setContainer,
      setStatus: actionCreators.setStatus
    },
    dispatch
  )
}

/* Connect map's to Container */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DashboardPage))
