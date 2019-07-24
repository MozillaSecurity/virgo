/** @format */

import React from 'react'
import { ipcRenderer } from 'electron'
import { withStyles } from '@material-ui/core'

import Logger from '../../../shared/logger'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const logger = new Logger('TaskInfo')

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  root: {}
})

class TaskInfo extends React.Component {
  state = {
    info: {}
  }

  componentDidMount() {
    ipcRenderer.on('container.stats', this.setTaskInfo)
  }

  componentWillUnmount() {
    this.stopRequestTaskInfo()
    ipcRenderer.removeListener('container.stats', this.setTaskInfo)
  }

  setTaskInfo = (event, data) => {
    if (data.error) {
      this.stopRequestTaskInfo()
    }
    if (data) {
      this.setState({ info: data.data })
    }
  }

  requestTaskInfo = containerId => {
    const id = containerId || this.props.id

    if (!id) {
      logger.info(`No container is running at the moment.`)
      return
    }

    logger.info(`Starting TaskInfo scheduler for container: ${id}`)
    this.scheduler = setInterval(() => {
      ipcRenderer.send('container.stats', {
        serializerName: 'LibFuzzer',
        id
      })
    }, 5000)
  }

  stopRequestTaskInfo = () => {
    if (!this.scheduler) {
      return
    }
    logger.info(`Removing container stats scheduler.`)
    clearInterval(this.scheduler)
    this.scheduler = null
  }

  render() {
    const { state, id, taskDefinition } = this.props

    if (!taskDefinition.hasOwnProperty('type')) {
      return null
    }
    if (taskDefinition.type !== 'LibFuzzer') {
      logger.warning('No task information available for this type task.')
      return null
    }

    if (this.scheduler && state !== 0) {
      logger.info('Stopping request task info.')
      this.stopRequestTaskInfo()
    }
    if (!this.scheduler && state === 0 && id) {
      logger.info('Requesting task info.')
      this.requestTaskInfo(id)
    }

    return DisplayLibFuzzerInfo(this.state.info)
  }
}

const numberWithCommas = str => {
  const n = parseInt(str)
  return !isNaN(n) ? n.toLocaleString() : 'N/A'
}

const DisplayLibFuzzerInfo = data => {
  const requiredData = {
    crashes: 'N/A',
    execs_done: 'N/A',
    execs_per_sec: 'N/A',
    ooms: 'N/A'
  }

  if (!data) {
    return
  }

  const receivedKeys = Object.keys(data)

  Object.keys(requiredData).forEach(name => {
    if (receivedKeys.includes(name)) {
      requiredData[name] = data[name]
    }
  })

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item container direction="row" justify="space-evenly" alignItems="center" spacing={16}>
        <Grid item>
          <Typography variant="body1">Test-cases </Typography>
        </Grid>
        <Grid item>
          <Typography color="primary">
            {numberWithCommas(requiredData.execs_done)} (
            {numberWithCommas(requiredData.execs_per_sec)} / sec)
          </Typography>
        </Grid>
      </Grid>
      <Grid item container direction="row" justify="space-evenly" alignItems="center" spacing={16}>
        <Grid item>
          <Typography variant="body1">Crashes </Typography>
        </Grid>
        <Grid item>
          <Typography color="primary">{numberWithCommas(requiredData.crashes)}</Typography>
        </Grid>
      </Grid>
      <Grid item container direction="row" justify="space-evenly" alignItems="center" spacing={16}>
        <Grid item>
          <Typography variant="body1">Out-of-Memory </Typography>
        </Grid>
        <Grid item>
          <Typography color="primary">{numberWithCommas(requiredData.ooms)}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(TaskInfo)
