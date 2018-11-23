/** @format */

import React from 'react'
import Typography from '@material-ui/core/Typography'
import * as _ from 'lodash'

import { ipcRenderer } from 'electron'

import Overview from './overview'

class ActivityPage extends React.Component {
  state = {
    containers: [],
    stoppedContainers: []
  }

  componentDidMount() {
    ipcRenderer.send('container.list')

    ipcRenderer.on('container.list', (evt, containers) => {
      const partitioned = _.partition(containers, c => c.State === 'running')
      this.setState({
        containers: partitioned[0].map(this.mapContainer),
        stoppedContainers: partitioned[1].map(this.mapContainer)
      })
    })
  }

  mapContainer(container) {
    return {
      id: container.Id,
      name: _.chain(container.Names)
        .map(n => n.substr(1))
        .join(', ')
        .value(),
      state: container.State,
      status: `${container.State} (${container.Status})`,
      image: container.Image
    }
  }

  render() {
    return <Overview containers={this.state.stoppedContainers} />
  }
}

export default ActivityPage
