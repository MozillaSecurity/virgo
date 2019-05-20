/** @format */

import { app, dialog } from 'electron'

import { Sentry } from './sentry'
import { Package, Environment } from './common'
import createTray from './tray'
import createMainWindow from './window'
import './api/ipc'

let mainWindow
let tray

const createWindow = () => {
  mainWindow = createMainWindow()
  tray = createTray(mainWindow)

  app.setAboutPanelOptions({
    applicationName: Package.name,
    applicationVersion: Package.version
  })
}

app.on('ready', () => {
  createWindow()
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
