/** @format */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'
import axios from 'axios'
import { random } from '@mozillasecurity/octo'

/* Styles */
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

/* Custom UI */
import Logo from '../../images/virgo-full.svg'
import RunTimer from './RunTimer'
import TaskInfo from './TaskInfo'

import Logger from '../../../shared/logger'
import * as actionCreators from '../../store/actions'
import FuzzManagerConf from '../../../shared/fuzzmanager'

const logger = new Logger('Dashboard')

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
    random.init()
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
    this.toggleSpinner(false)
  }

  inspectContainer = (event, data) => {
    const { setContainerData, setContainer, setStatus, resetStatus, status } = this.props

    if (data.error && status.id) {
      let text
      if (data.code === 404) {
        text = `Task terminated previously.`
      } else {
        text = `Task stopped outside of normal workflow.`
      }

      setContainerData([])
      setContainer({})
      this.stopInspectScheduler()
      resetStatus()
      setStatus({
        text,
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
    this.toggleSpinner(false)
    setContainerData([])
    setContainer({})
  }

  pauseContainer = (event, id) => {
    const { setStatus } = this.props

    setStatus({ text: `Container ${id} paused successfully.`, state: PAUSED })
    this.toggleSpinner(false)
  }

  unpauseContainer = (event, id) => {
    const { setStatus } = this.props

    setStatus({ text: `Container ${id} resumed successfully.`, state: RUNNING })
    this.toggleSpinner(false)
  }

  imageError = (event, error) => {
    const { setStatus } = this.props

    setStatus({ text: `Error: ${error.message}`, state: STOPPED })
    this.toggleSpinner(false)
  }

  containerError = (event, error) => {
    const { setStatus, resetStatus } = this.props

    resetStatus()
    setStatus({ text: `Error: ${error.message}`, state: STOPPED })
    this.toggleSpinner(false)
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

    /* Retrieve a random task. */
    const taskDefinition = this.analyzeSuitableTask(definitions)

    const fuzzmanagerconf = new FuzzManagerConf({ configName: 'fuzzmanagerconf' })

    /* Mount point for our FuzzManager backend configuration. */
    const volumes = [`${fuzzmanagerconf.path}:/home/worker/.fuzzmanagerconf`]

    /* Indicating that we treat setting `clientid` differently. */
    taskDefinition.environment.push(`VIRGO=True`)

    this.toggleSpinner(true)
    setStatus({ text: `Initializing task.`, definition: taskDefinition })
    ipcRenderer.send('container.run', { task: taskDefinition, volumes })
  }

  onResume = () => {
    const { container, setStatus } = this.props
    const { id } = container

    if (!id) {
      this.toggleSpinner(false)
      setStatus({ text: `No container ID available.` })
      return
    }

    this.toggleSpinner(true)
    setStatus({ text: `Resuming container with ID: ${id}` })
    ipcRenderer.send('container.unpause', { id })
  }

  onStop = () => {
    const { container, setStatus } = this.props
    const { id } = container

    if (!id) {
      this.toggleSpinner(false)
      setStatus({ text: `No container ID available.` })
      return
    }

    this.toggleSpinner(true)
    setStatus({ text: `Stopping container with ID: ${id}` })
    ipcRenderer.send('container.stop', { id })
  }

  onPause = () => {
    const { container, setStatus } = this.props
    const { id } = container

    if (!id) {
      this.toggleSpinner(false)
      setStatus({ text: `No container ID available.` })
      return
    }

    this.toggleSpinner(true)
    setStatus({ text: `Pausing container with ID: ${id}` })
    ipcRenderer.send('container.pause', { id })
  }

  /*
   * Component Actions
   */
  startInspectScheduler = containerId => {
    const { status } = this.props
    const id = containerId || status.id

    if (!id) {
      logger.info(`No container is running at the moment.`)
      return
    }

    /**
     * If the components switches while the user pressed Stop, then the inspection scheduler
     * is removed. If the user switches back to this component, it will pick up the status.id
     * and re-initiate the scheduler, even if the container already stopped in the background.
     */
    logger.info(`Starting inspection scheduler for container: ${id}`)
    this.inspectScheduler = setInterval(() => ipcRenderer.send('container.inspect', { id }), 5000)
  }

  stopInspectScheduler = () => {
    if (!this.inspectScheduler) {
      return
    }
    logger.info(`Removing inspection scheduler.`)
    clearInterval(this.inspectScheduler)
    this.inspectScheduler = null
  }

  toggleSpinner = manualToggle => {
    const { setStatus, status } = this.props
    setStatus({ showSpinner: manualToggle !== undefined ? manualToggle : !status.showSpinner })
  }

  analyzeSuitableTask = definitions => {
    return random.item(definitions)
  }

  fetchTaskDefinitions() {
    const { taskURL, setImageDefinitions } = this.props

    axios
      .get(taskURL)
      .then(response => {
        setImageDefinitions(response.data.tasks)
      })
      .catch(error => {
        logger.error(`Error fetching task definitions: ${error}`)
      })
  }

  render() {
    const { classes, status, setStatus, definitions } = this.props

    return (
      <Grid container spacing={40} className={classes.root}>
        <Grid item xs={12}>
          <img src={Logo} alt="Virgo" />
        </Grid>
        <RunTimer
          disabled={definitions.length === 0}
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
        {status.state === RUNNING || status.state === PAUSED ? (
          <TaskInfo id={status.id} state={status.state} taskDefinition={status.definition}/>
        ) : null}
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
  // return ...docker
  return {
    definitions: state.docker.definitions,
    imageError: state.docker.imageError,
    containerError: state.docker.containerError,
    containerData: state.docker.containerData,
    container: state.docker.container,
    taskURL: state.preferences.taskURL,
    contactEmail: state.preferences.contactEmail,
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
