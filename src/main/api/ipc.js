/** @format */

import { ipcMain } from 'electron'

import DockerManager from './docker'
import Logger from '../../shared/logger'

const logger = new Logger('IPC')

// try {
const dockerManager = new DockerManager()
// } catch (error) {
// Error: ENOENT: no such file or directory, stat '/var/run/docker.sock'
// Call setup routines for Docker engine.
// console.log(error)
// }

const getErrorMessage = error => {
  /*
  Variation #1
  error -> {"statusCode":502,"json":"Bad response from Docker engine\n"}
  error.message -> "(HTTP code 502) unexpected - Bad response from Docker engine\n "

  Variation #2
  error -> {"reason":"no such container","statusCode":404,"json":{"message":"..."}}

  Variation #3
  error -> {"statusCode":502,"json":null}
  */
  if (Object.prototype.hasOwnProperty.call(error, 'json')) {
    switch (typeof error.json) {
      case 'string':
        return error.json
      case 'object':
        if (error.json !== null && 'message' in error.json) {
          return error.json.message
        }
        break
      default:
        return 'Unknown error message.'
    }
  }
  if (Object.prototype.hasOwnProperty.call(error, 'message')) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error type.'
}

const getError = error => {
  return { error: true, code: error.statusCode, message: getErrorMessage(error) }
}

/**
 * Pull an image, create a container and start that container.
 */
ipcMain.on('container.run', (event, args) => {
  const {
    task: { name, environment },
    volumes,
    pullOptions
  } = args

  const createOptions = {
    Image: name,
    Tty: true,
    Env: environment || [],
    Volumes: {
      '/home/worker': {}
    },
    HostConfig: {
      AutoRemove: true,
      Binds: [...volumes]
    }
  }

  dockerManager
    .pull(name, pullOptions || {})
    .then(() => {
      event.sender.send('image.pull', name)
      /**
       * Create a container of the pulled image. Each container removes itself on error or on stop.
       */
      dockerManager.docker
        .createContainer(createOptions)
        .then(container => {
          logger.info('Launching container...')
          return container.start()
        })
        .then(container => {
          logger.info(`Container ${container.id} started!`)
          event.sender.send('container.run', container)
        })
        .catch(error => {
          logger.error(`Container start error: ${JSON.stringify(error)}`)
          event.sender.send('container.error', getError(error))
        })
    })
    .catch(error => {
      logger.error(`Image pull error: ${JSON.stringify(error)}`)
      event.sender.send('image.error', getError(error))
    })
})

/*
 * Stop a running container.
 */
ipcMain.on('container.stop', (event, args) => {
  const { id } = args

  dockerManager
    .getContainer(id)
    .then(container => {
      return container.stop()
    })
    .then(() => {
      event.sender.send('container.stop', id)
    })
    .catch(error => {
      logger.error(`Container stop error: ${JSON.stringify(error)}`)
      event.sender.send('container.error', getError(error))
    })
})

/**
 * Pause a running container.
 */
ipcMain.on('container.pause', (event, args) => {
  const { id } = args

  dockerManager
    .getContainer(id)
    .then(container => {
      return container.pause()
    })
    .then(() => {
      event.sender.send('container.pause', id)
    })
    .catch(error => {
      logger.error(`Container pause error: ${JSON.stringify(error)}`)
      event.sender.send('container.error', getError(error))
    })
})

/**
 * Unpause a paused container.
 */
ipcMain.on('container.unpause', (event, args) => {
  const { id } = args

  dockerManager
    .getContainer(id)
    .then(container => {
      return container.unpause()
    })
    .then(() => {
      event.sender.send('container.unpause', id)
    })
    .catch(error => {
      logger.error(`Container unpause error: ${JSON.stringify(error)}`)
      event.sender.send('container.error', getError(error))
    })
})

/**
 * Remove a container.
 */
ipcMain.on('container.remove', (event, args) => {
  const { id } = args

  dockerManager
    .getContainer(id)
    .then(container => {
      return container.remove({ force: true })
    })
    .then(() => {
      event.sender.send('container.remove', { data: null, error: false })
    })
    .catch(error => {
      logger.error(`Container remove error: ${JSON.stringify(error)}`)
      event.sender.send('container.remove', getError(error))
    })
})

/**
 * List stopped and started containers.
 */
// eslint-disable-next-line no-unused-vars
ipcMain.on('container.list', (event, args) => {
  dockerManager.docker.listContainers({ all: true }).then(containers => {
    event.sender.send('container.list', containers)
  })
})

/**
 * List downloaded images.
 */
// eslint-disable-next-line no-unused-vars
ipcMain.on('image.list', (event, args) => {
  dockerManager.docker.listImages().then(images => {
    event.sender.send('image.list', images)
  })
})

/**
 * Remove downloaded image.
 */
ipcMain.on('image.remove', (event, args) => {
  const { name } = args

  dockerManager.docker
    .getImage(name)
    .remove()
    .then(image => {
      event.sender.send('image.remove', { data: image, error: false })
    })
    .catch(error => {
      logger.error(`Image remove error: ${JSON.stringify(error)}`)
      event.sender.send('image.remove', getError(error))
    })
})

/**
 * Get container information.
 */
ipcMain.on('container.inspect', (event, args) => {
  const { id } = args

  dockerManager
    .getContainer(id)
    .then(container => {
      return container.inspect()
    })
    .then(data => {
      event.sender.send('container.inspect', { data, error: false })
    })
    .catch(error => {
      logger.error(`Container inspect error: ${JSON.stringify(error)}`)
      event.sender.send('container.inspect', getError(error))
    })
})
