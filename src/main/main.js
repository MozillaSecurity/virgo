/** @format */

import { app, dialog } from 'electron'

// eslint-disable-next-line no-unused-vars
import Sentry from '../shared/sentry'
import { setupUpdater } from './updater'
import { Package, Environment } from '../shared/common'
import Logger from '../shared/logger'
import createTray from './tray'
import createMainWindow from './windows/main'
import './api/ipc'

const logger = new Logger('MainProcess')

if (Environment.isDevelopment) {
  /* Disable annoying security warnings because we run a development server. */
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
}

// eslint-disable-next-line no-unused-vars
let tray
let mainWindow

const instanceLock = app.requestSingleInstanceLock()
if (!instanceLock) {
  app.quit()
}

const createWindow = () => {
  mainWindow = createMainWindow()
  tray = createTray(mainWindow)

  if (!Environment.isWindows) {
    app.setAboutPanelOptions({
      applicationName: Package.name,
      applicationVersion: Package.version
    })
  }
}

// eslint-disable-next-line no-unused-vars
app.on('second-instance', (event, argv, cwd) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }
})

app.on('ready', () => {
  createWindow()
  setupUpdater(mainWindow)
})

app.on('window-all-closed', () => {
  if (!Environment.isMacOS) {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (Environment.isMacOS) {
    app.quitting = true
  }
})

app.on('activate', () => {
  if (Environment.isMacOS && mainWindow !== null) {
    mainWindow.show()
  }
})

process.on('uncaughtException', error => {
  const message = 'Uncaught exception in the Main process. Application will shut down.'
  const messageBoxOptions = {
    type: 'error',
    title: 'Main process crashed unexpectedly!',
    message
  }
  logger.error(message)
  dialog.showMessageBox(messageBoxOptions)
})
