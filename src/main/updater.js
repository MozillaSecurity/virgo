/** @format */

import { app, dialog, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import appRoot from 'app-root-path'

import Logger from '../shared/logger'
import Store from './store'
import { Environment } from '../shared/common'

const logger = new Logger('Updater')

autoUpdater.logger = logger
autoUpdater.allowPrerelease = Store.get('allowPreRelease', false)

if (Environment.isDevelopment) {
  autoUpdater.updateConfigPath = appRoot.resolve('./configs/minio/dev-app-update.yml')
}

const ensureSafeQuitAndInstall = () => {
  /* Close windows more agressively because of the custom MacOS window close functionlity. */
  const isSilent = true
  const isForceRunAfter = true
  app.removeAllListeners('window-all-closed')
  BrowserWindow.getAllWindows().map(browserWindow => browserWindow.removeAllListeners('close'))
  autoUpdater.quitAndInstall(isSilent, isForceRunAfter)
}

export const isNetworkError = error => {
  return (
    error.message === 'net::ERR_CONNECTION_REFUSED' ||
    error.message === 'net::ERR_INTERNET_DISCONNECTED' ||
    error.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
    error.message === 'net::ERR_CONNECTION_RESET' ||
    error.message === 'net::ERR_CONNECTION_CLOSE' ||
    error.message === 'net::ERR_NAME_NOT_RESOLVED' ||
    error.message === 'net::ERR_CONNECTION_TIMED_OUT'
  )
}

export const checkUpdates = () => {
  autoUpdater.checkForUpdates().catch(error => {
    if (isNetworkError(error)) {
      logger.error('Network error.')
    } else {
      logger.error(`Error: ${error === null ? 'Unknown' : (error.message || error).toString()}`)
    }
  })
}

export const setupUpdater = window => {
  const dispatch = data => {
    logger.info(`Dispatch: ${JSON.stringify(data)}`)
    window.webContents.send('updateMessage', data)
  }

  autoUpdater.on('error', error => {
    dispatch({ msg: `😱 ${error}` })
  })

  autoUpdater.on('checking-for-update', () => {
    dispatch({ msg: `🔎 Checking for updates ...` })
  })

  // eslint-disable-next-line no-unused-vars
  autoUpdater.on('update-available', info => {
    dispatch({ msg: `🎉 Update available. Downloading ...`, hide: false })
  })

  // eslint-disable-next-line no-unused-vars
  autoUpdater.on('update-not-available', info => {
    dispatch({ msg: '😊 You are using the latest version.' })
  })

  autoUpdater.on('download-progress', progress => {
    window.webContents.send('download-progress', {
      percent: progress.percent,
      speed: progress.bytesPerSecond
    })
  })

  // eslint-disable-next-line no-unused-vars
  autoUpdater.on('update-downloaded', info => {
    dispatch({ msg: `🤘 Update downloaded.` })

    const messageBoxOptions = {
      type: 'question',
      title: 'Found Updates',
      message: `A new version has been downloaded. Would you like to install it now?`,
      buttons: ['Yes', 'No'],
      defaultId: 0
    }

    dialog.showMessageBox(messageBoxOptions, response => {
      if (response === 0) {
        ensureSafeQuitAndInstall()
      }
    })
  })

  dispatch({ msg: `🖥 App version: ${app.getVersion()}` })

  if (!Environment.isDevelopment) {
    checkUpdates()
  }
}

ipcMain.on('updateCheck', () => {
  checkUpdates()
})

export default autoUpdater
