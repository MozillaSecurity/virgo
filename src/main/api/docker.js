/** @format */

import fs from 'fs'
import Docker from 'dockerode'

class DockerManager {
  constructor(userOptions = {}) {
    let status
    let options = {}

    console.log(`Initializing DockerManager for Platform: ${process.platform}`)

    if (process.platform === 'win32') {
      options = {
        socketPath: '//./pipe/docker_engine'
      }
    } else {
      options = {
        socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock'
      }
    }

    options = Object.assign(options, userOptions)

    try {
      if (process.platform === 'win32') {
        status = fs.statSync(options.socketPath).isFile()
      } else {
        status = fs.statSync(options.socketPath).isSocket()
      }
    } catch (error) {
      status = false
    }

    if (!status) {
      throw new Error('Are you sure Docker is running?')
    }

    this.docker = new Docker(options)
  }

  async listContainers() {
    return await this.docker.listContainers({ all: true })
  }

  async getContainer(id) {
    return await this.docker.getContainer(id)
  }

  pull(name) {
    return new Promise((resolve, reject) => {
      this.docker.pull(name, (error, stream) => {
        if (error) {
          console.log(`Premature PULL error!`)
          reject(error)
          return
        }

        const onFinished = (error, output) => {
          if (error) {
            console.log(`PULL error in onFinished.`)
            reject(error)
            return
          }
          console.log(`Successfully pulled ${name}.`)
          resolve()
        }

        const onProgress = event => {}

        this.docker.modem.followProgress(stream, onFinished, onProgress)
      })
    })
  }
}

export default DockerManager
