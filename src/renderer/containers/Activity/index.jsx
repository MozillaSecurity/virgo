/** @format */

import React from 'react'
import * as _ from 'lodash'

import { ipcRenderer } from 'electron'

import ImageList from './ImageListItem'

class ActivityPage extends React.Component {
  state = {
    images: []
  }

  componentDidMount() {
    ipcRenderer.on('image.list', (evt, images) => {
      this.setState({ images: images.map(image => this.mapImage(image)) })
    })

    ipcRenderer.send('image.list')
  }

  componentWillUnmount() {
    // removeEventListener('image.list', ipcRenderer)
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const dm = decimals <= 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  mapImage(image) {
    return {
      id: image.Id.substr(7, 12),
      size: this.formatBytes(image.Size),
      date: new Date(image.Created * 1000).toLocaleDateString(),
      containers: image.Containers === -1 ? 0 : image.Containers,
      tags: image.RepoTags
    }
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
    const { images } = this.state
    return <ImageList images={images} />
  }
}

export default ActivityPage
