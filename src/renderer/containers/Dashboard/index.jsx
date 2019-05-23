/** @format */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'
import axios from 'axios'

/* Styles */
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

/* Custom UI */
import Logo from '../../images/virgo-full.svg'
import RunTimer from './RunTimer'

import * as actionCreators from '../../store/actions'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100% !important', // Beware: https://material-ui.com/layout/grid/#negative-margin
    textAlign: 'center'
  }
})

const STOPPED = -1
const RUNNING = 0
const PAUSED = 1

class DashboardPage extends React.Component {
  async componentDidMount() {
    await this.fetchTaskDefinitions()

    this.startInspectScheduler()

    ipcRenderer.on('image.pull', this.pullImage)
    ipcRenderer.on('container.run', this.runContainer)
    ipcRenderer.on('container.inspect', this.inspectContainer)
    ipcRenderer.on('container.stop', this.stopContainer)
    ipcRenderer.on('container.pause', this.pauseContainer)
    ipcRenderer.on('container.unpause', this.unpauseContainer)
    ipcRenderer.on('image.error', this.imageError)
    ipcRenderer.on('container.error', this.containerError)
  }

  componentWillUnmount() {
    this.stopInspectScheduler()

    ipcRenderer.removeListener('container.stop', this.stopContainer)
    ipcRenderer.removeListener('image.pull', this.pullImage)
    ipcRenderer.removeListener('container.run', this.runContainer)
    ipcRenderer.removeListener('container.inspect', this.inspectContainer)
    ipcRenderer.removeListener('container.stop', this.stopContainer)
    ipcRenderer.removeListener('container.pause', this.pauseContainer)
    ipcRenderer.removeListener('container.unpause', this.unpauseContainer)
    ipcRenderer.removeListener('image.error', this.imageError)
    ipcRenderer.removeListener('container.error', this.containerError)
  }

  /*
   * IPC Event Handlers
   */
  pullImage = (event, data) => {
    const { setStatus } = this.props

    setStatus({ text: `Downloading task: ${data}` })
  }

  runContainer = (event, container) => {
    const { setContainer, setStatus } = this.props

    setContainer(container)
    this.startInspectScheduler(container.id)
    setStatus({ text: `Task is running`, id: container.id, state: RUNNING })
    this.toggleSpinner()
  }

  inspectContainer = (event, data) => {
    const { setContainerData, setContainer, setStatus, resetStatus, status } = this.props

    if (data.error && status.id) {
      setContainerData([])
      setContainer({})
      this.stopInspectScheduler()
      resetStatus()
      setStatus({
        text: `Task stopped outside of normal workflow.`,
        state: STOPPED,
        id: null,
        delta: 0
      })
      return
    }

    setContainerData(data)
  }

  stopContainer = (event, id) => {
    const { setContainerData, setContainer, setStatus } = this.props

    setStatus({ text: `Container ${id} stopped successfully.`, state: STOPPED })
    this.stopInspectScheduler()
    this.toggleSpinner()
    setContainerData([])
    setContainer({})
  }

  pauseContainer = (event, id) => {
    const { setStatus } = this.props

    setStatus({ text: `Container ${id} paused successfully.`, state: PAUSED })
    this.toggleSpinner()
  }

  unpauseContainer = (event, id) => {
    const { setStatus } = this.props

    setStatus({ text: `Container ${id} unpaused successfully.`, state: RUNNING })
    this.toggleSpinner()
  }

  imageError = (event, error) => {
    const { setStatus } = this.props

    setStatus({ text: `Image error: ${error.reason}`, state: STOPPED })
  }

  containerError = (event, error) => {
    const { setStatus } = this.props

    setStatus({ text: `Container error: ${error.reason}`, state: STOPPED })
    this.stopInspectScheduler()
  }

  /*
   * Action initiators
   */
  onStart = () => {
    const { definitions, setStatus } = this.props

    if (definitions.length === 0) {
      setStatus({ text: `No remote tasks available.` })
      return
    }

    this.toggleSpinner()
    const image = this.analyzeSuitableTask(definitions)
    setStatus({ text: `Initializing task.` })
    ipcRenderer.send('container.run', image)
  }

  onResume = () => {
    const { container, setStatus } = this.props
    const { id } = container

    if (!id) {
      setStatus({ text: `No container ID available.` })
      return
    }

    this.toggleSpinner()
    setStatus({ text: `Unpausing container with ID: ${id}` })
    ipcRenderer.send('container.unpause', { id })
  }

  onStop = () => {
    const { container, setStatus } = this.props
    const { id } = container

    if (!id) {
      setStatus({ text: `No container ID available.` })
      return
    }

    this.toggleSpinner()
    setStatus({ text: `Stopping container with ID: ${id}` })
    ipcRenderer.send('container.stop', { id })
  }

  onPause = () => {
    const { container, setStatus } = this.props
    const { id } = container

    if (!id) {
      setStatus({ text: `No container ID available.` })
      return
    }

    this.toggleSpinner()
    setStatus({ text: `Pausing container with ID: ${id}` })
    ipcRenderer.send('container.pause', { id })
  }

  /*
   * Component specifc actions
   */
  startInspectScheduler = containerId => {
    const { status } = this.props
    const id = containerId || status.id

    if (!id) {
      console.log(`No container is running at the moment.`)
      return
    }

    if (id && status.state !== STOPPED) {
      console.log(`Starting inspection scheduler for container: ${id}`)
      this.inspectScheduler = setInterval(() => ipcRenderer.send('container.inspect', { id }), 5000)
    }
  }

  stopInspectScheduler = () => {
    if (this.inspectScheduler) {
      console.log(`Removing inspection scheduler.`)
      clearInterval(this.inspectScheduler)
      this.inspectScheduler = null
    }
  }

  toggleSpinner = () => {
    const { setStatus, status } = this.props
    setStatus({ showSpinner: !status.showSpinner })
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

  render() {
    const { classes, status, setStatus } = this.props

    return (
      <Grid container spacing={40} className={classes.root}>
        <Grid item xs={12}>
          <img src={Logo} alt="Virgo" />
        </Grid>
        <RunTimer
          elapsed={status.delta}
          setStatus={setStatus}
          status={status}
          startCallback={this.onStart}
          pauseCallback={this.onPause}
          resumeCallback={this.onResume}
          stopCallback={this.onStop}
        />
        <Grid item xs={12}>
          {status.showSpinner ? <CircularProgress className={classes.progress} /> : null}
        </Grid>
      </Grid>
    )
  }
}

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
  setStatus: PropTypes.func.isRequired,
  resetStatus: PropTypes.func.isRequired
}

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

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setImageDefinitions: actionCreators.setImageDefinitions,
      setImageError: actionCreators.setImageError,
      setContainerError: actionCreators.setContainerError,
      setContainerData: actionCreators.setContainerData,
      setContainer: actionCreators.setContainer,
      setStatus: actionCreators.setStatus,
      resetStatus: actionCreators.resetStatus
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DashboardPage))
