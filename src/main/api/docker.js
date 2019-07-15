/** @format */

import fs from 'fs'
import Docker from 'dockerode'

import Logger from '../../shared/logger'

const logger = new Logger('DockerManager')

class DockerManager {
  constructor(userOptions = {}) {
    let status
    let options = {}

    logger.info(`Initializing DockerManager for Platform: ${process.platform}`)

    if (process.platform === 'win32') {
      options = {
        socketPath: '//./pipe/docker_engine'
      }
    } else {
      options = {
        socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock'
      }
    }
    options = Object.assign({}, options, userOptions)

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

  async info() {
    return this.docker.info()
  }

  async getContainer(id) {
    return this.docker.getContainer(id)
  }

  pull(name, options) {
    return new Promise((resolve, reject) => {
      this.docker.pull(name, options, (error, stream) => {
        if (error) {
          logger.error(`Premature pull error!`)
          reject(error)
          return
        }

        // eslint-disable-next-line no-shadow,no-unused-vars
        const onFinished = (error, output) => {
          if (error) {
            logger.error(`Pull error in onFinished..`)
            reject(error)

            return
          }
          logger.info(`Successfully pulled  ${name}.`)
          resolve()
        }

        // eslint-disable-next-line no-unused-vars
        const onProgress = event => {}

        this.docker.modem.followProgress(stream, onFinished, onProgress)
      })
    })
  }
}

export default DockerManager
