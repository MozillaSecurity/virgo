/** @format */

import { app, dialog } from 'electron'

import { Sentry } from './sentry'
import { appDefinition } from './common'
import createTray from './tray'
import createMainWindow from './window'
import './api/ipc'

let mainWindow
let tray

const createWindow = () => {
  mainWindow = createMainWindow()
  tray = createTray(mainWindow)

  app.setAboutPanelOptions({
    applicationName: appDefinition.name,
    applicationVersion: appDefinition.version
  })
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
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
