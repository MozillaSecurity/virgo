/** @format */

import { app, dialog, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'
import appRoot from 'app-root-path'

import Store from './store'
import { Environment } from './common'

autoUpdater.logger = logger
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.allowPrerelease = Store.get('allowPreRelease', false)

if (!Environment.isProduction) {
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

export const setupUpdater = window => {
  const dispatch = data => {
    console.log(JSON.stringify(data))
    window.webContents.send('updateMessage', data)
  }

  autoUpdater.on('error', error => {
    dispatch({ msg: `😱 Error: ${error}` })
  })

  autoUpdater.on('checking-for-update', () => {
    dispatch({ msg: `🔎 Checking for updates ...` })
  })

  autoUpdater.on('update-available', info => {
    dispatch({ msg: `🎉 Update available. Downloading ...`, hide: false })
  })

  autoUpdater.on('update-not-available', info => {
    dispatch({ msg: '👎 Update not available.' })
  })

  autoUpdater.on('download-progress', progress => {
    window.webContents.send('download-progress', {
      percent: progress.percent,
      speed: progress.bytesPerSecond
    })
  })

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
  autoUpdater.checkForUpdates()
}

export default autoUpdater
