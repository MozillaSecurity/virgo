/** @format */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'
import axios from 'axios'

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
import Logo from '../../images/virgo-full.svg'
import TimeCounter from '../../components/TimeCounter'

import * as actionCreators from '../../store/actions'

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

const IDLE = -1
const RUNNING = 0
const PAUSED = 1
const STOPPED = 2

class DashboardPage extends React.Component {
  async componentDidMount() {
    await this.fetchTaskDefinitions()

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
    const { setStatus } = this.props
    setStatus({ text: `Downloading task: ${data}` })
  }

  runContainer = (event, container) => {
    const { setContainer, setStatus } = this.props
    setContainer(container)
    this.refreshSheduler = setInterval(() => ipcRenderer.send('container.inspect', container), 5000)
    setStatus({ text: `Task is running`, state: RUNNING })
    this.toggleSpinner()
    this.toggleTimer()
  }

  inspectContainer = (event, data) => {
    const { setContainerData } = this.props
    setContainerData(data)
  }

  stopContainer = (event, id) => {
    const { setContainerData, setContainer, setStatus } = this.props
    clearInterval(this.refreshSheduler)
    setStatus({ text: `Container ${id} stopped successfully.`, state: STOPPED })
    setContainerData([])
    setContainer({})
    this.toggleSpinner()
    this.toggleTimer()
  }

  pauseContainer = (event, id) => {
    const { setStatus } = this.props
    setStatus({ text: `Container ${id} paused successfully.`, state: PAUSED })
    this.toggleSpinner()
    this.toggleTimer()
  }

  unpauseContainer = (event, id) => {
    const { setStatus } = this.props
    setStatus({ text: `Container ${id} unpaused successfully.`, state: RUNNING })
    this.toggleSpinner()
    this.toggleTimer()
  }

  imageError = (event, error) => {
    const { setStatus } = this.props
    setStatus({ text: `Image error: ${error.reason}` })
  }

  containerError = (event, error) => {
    const { setStatus } = this.props
    clearInterval(this.refreshSheduler)
    setStatus({ text: `Container error: ${error.reason}` })
  }

  onStart = () => {
    const { definitions, container, setStatus, status } = this.props

    switch (status.state) {
      case IDLE:
      case STOPPED: {
        if (definitions.length === 0) {
          setStatus({ text: `No remote tasks available.` })
        } else {
          this.toggleSpinner()
          const image = this.analyzeSuitableTask(definitions)
          setStatus({ text: `Initializing task.` })
          ipcRenderer.send('container.run', image)
        }
        break
      }
      case PAUSED: {
        const { id } = container
        if (!id) {
          setStatus({ text: `No container ID available.` })
        } else {
          this.toggleSpinner()
          setStatus({ text: `Unpausing container with ID: ${id}` })
          ipcRenderer.send('container.unpause', { id })
        }
        break
      }
      default:
        break
    }
  }

  onStop = () => {
    const { container, setStatus, status } = this.props

    switch (status.state) {
      case PAUSED:
      case RUNNING: {
        const { id } = container
        if (!id) {
          setStatus({ text: `No container ID available.` })
        } else {
          this.toggleSpinner()
          setStatus({ text: `Stopping container with ID: ${id}` })
          ipcRenderer.send('container.stop', { id })
        }
        break
      }
      default:
        break
    }
  }

  onPause = () => {
    const { container, setStatus, status } = this.props

    switch (status.state) {
      case RUNNING: {
        const { id } = container
        if (!id) {
          setStatus({ text: `No container ID available.` })
        } else {
          this.toggleSpinner()
          setStatus({ text: `Pausing container with ID: ${id}` })
          ipcRenderer.send('container.pause', { id })
        }
        break
      }
      default:
        break
    }
  }

  toggleSpinner = () => {
    const { setStatus, status } = this.props
    setStatus({ showSpinner: !status.showSpinner })
  }

  updateTimer = () => {
    const { setStatus, status } = this.props
    const delta = Date.now() - status.startTime
    setStatus({ timeElapsed: status.timeElapsed + delta, startTime: Date.now() })
  }

  analyzeSuitableTask = definitions => {
    return definitions[0]
  }

  fetchTaskDefinitions() {
    const { taskURL, setImageDefinitions } = this.props
    axios
      .get(taskURL)
      .then(response => {
        setImageDefinitions(response.data)
      })
      .catch(error => {
        console.log(`Error fetching task definitions: ${error}`)
      })
  }

  toggleTimer() {
    const { setStatus, status } = this.props

    switch (status.state) {
      case RUNNING: {
        setStatus({ startTime: Date.now() })
        this.timer = setInterval(this.updateTimer, 1000)
        break
      }
      case STOPPED: {
        setStatus({ state: IDLE, timeElapsed: 0, startTime: 0, text: `` })
        clearInterval(this.timer)
        break
      }
      default:
        clearInterval(this.timer)
    }
  }

  render() {
    const { classes, definitions, status } = this.props

    const isRunning = status.state === RUNNING
    const isPaused = status.state === PAUSED
    const isStopped = status.state === STOPPED

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
                {definitions.length} Tasks available.
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
  definitions: PropTypes.array.isRequired,
  setContainer: PropTypes.func.isRequired,
  setContainerData: PropTypes.func.isRequired,
  container: PropTypes.object,
  containerData: PropTypes.any,
  imageError: PropTypes.object,
  containerError: PropTypes.object,
  taskURL: PropTypes.string.isRequired,
  status: PropTypes.object.isRequired,
  setStatus: PropTypes.func.isRequired
}

/* States */
const mapStateToProps = state => {
  return {
    definitions: state.docker.definitions,
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
