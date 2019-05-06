/** @format */

import React, { useState } from 'react'
import { ipcRenderer } from 'electron'

import ImageList from './ImageListItem'

import { mapImage } from '../../lib/docker'

class DockerImages extends React.Component {
  state = {
    images: []
  }

  componentDidMount() {
    ipcRenderer.on('image.list', this.listImages)
    ipcRenderer.send('image.list')
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('image.list', this.listImages)
  }

  listImages = (event, images) => {
    this.setState({ images: images.map(image => mapImage(image)) })
  }

  render() {
    const { images } = this.state
    return <ImageList images={images} />
  }
}

export default DockerImages
