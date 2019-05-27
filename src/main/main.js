/** @format */

import { app, dialog } from 'electron'

import { Sentry } from './sentry'
import { setupUpdater } from './updater'
import { Package, Environment } from './common'
import createTray from './tray'
import createMainWindow from './windows/main'
import './api/ipc'

let mainWindow
let tray

const instanceLock = app.requestSingleInstanceLock()
if (!instanceLock) {
  app.quit()
}

const createWindow = () => {
  mainWindow = createMainWindow()
  tray = createTray(mainWindow)

  app.setAboutPanelOptions({
    applicationName: Package.name,
    applicationVersion: Package.version
  })
}

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
  console.log(message)
  dialog.showMessageBox(messageBoxOptions)
})
