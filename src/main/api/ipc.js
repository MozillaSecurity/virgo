/** @format */

import { ipcMain } from 'electron'

import DockerManager from './docker'

// try {
const docker = new DockerManager()
// } catch (error) {
// Error: ENOENT: no such file or directory, stat '/var/run/docker.sock'
// Call setup routines for Docker engine.
// console.log(error)
// }

/**
 * Pull an image, create a container and start that container.
 */
ipcMain.on('container.run', (event, args) => {
  const { name } = args

  docker
    .pull(name)
    .then(() => {
      event.sender.send('image.pull', name)
      /**
       * Create a container of the pulled image. Each container removes itself on error or on stop.
       */
      docker.docker
        .createContainer({
          Image: name,
          Tty: true,
          HostConfig: { AutoRemove: true }
        })
        .then(container => {
          return container.start()
        })
        .then(container => {
          console.log(container.id)
          event.sender.send('container.run', container)
        })
        .catch(error => {
          event.sender.send('container.error', error)
        })
      /* */
    })
    .catch(error => {
      event.sender.send('image.error', error)
    })
})

/*
 * Stop a running container.
 */
ipcMain.on('container.stop', (event, args) => {
  const { id } = args

  docker
    .getContainer(id)
    .then(container => {
      return container.stop()
    })
    .then(() => {
      event.sender.send('container.stop', id)
    })
    .catch(error => {
      event.sender.send('container.error', error)
    })
})

/**
 * Pause a running container.
 */
ipcMain.on('container.pause', (event, args) => {
  const { id } = args

  docker
    .getContainer(id)
    .then(container => {
      return container.pause()
    })
    .then(() => {
      event.sender.send('container.pause', id)
    })
    .catch(error => {
      event.sender.send('container.error', error)
    })
})

/**
 * Unpause a paused container.
 */
ipcMain.on('container.unpause', (event, args) => {
  const { id } = args

  docker
    .getContainer(id)
    .then(container => {
      return container.unpause()
    })
    .then(() => {
      event.sender.send('container.unpause', id)
    })
    .catch(error => {
      event.sender.send('container.error', error)
    })
})

/**
 * Remove a container.
 */
ipcMain.on('container.remove', (event, args) => {
  const { id } = args

  docker
    .getContainer(id)
    .then(container => {
      return container.remove({ force: true })
    })
    .then(() => {
      event.sender.send('container.remove', { data: null, error: false })
    })
    .catch(error => {
      event.sender.send('container.remove', { data: error, error: true })
    })
})

/**
 * List stopped and started containers.
 */
ipcMain.on('container.list', (event, args) => {
  docker.listContainers().then(containers => {
    event.sender.send('container.list', containers)
  })
})

/**
 * List downloaded images.
 */
ipcMain.on('image.list', (event, args) => {
  docker.docker.listImages().then(images => {
    event.sender.send('image.list', images)
  })
})

/**
 * Remove downloaded image.
 */
ipcMain.on('image.remove', (event, args) => {
  const { name } = args

  docker.docker
    .getImage(name)
    .remove()
    .then(image => {
      event.sender.send('image.remove', { data: image, error: false })
    })
    .catch(error => {
      event.sender.send('image.remove', { data: error, error: true })
    })
})

/**
 * Get container information.
 */
ipcMain.on('container.inspect', (event, args) => {
  const { id } = args

  docker
    .getContainer(id)
    .then(container => {
      return container.inspect()
    })
    .then(data => {
      event.sender.send('container.inspect', { data, error: false })
    })
    .catch(error => {
      event.sender.send('container.inspect', { data: error, error: true })
    })
})
