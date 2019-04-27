/** @format */

import { app } from 'electron'

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

app.on('ready', createWindow)

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
  console.log('App crashed unexpectedly.')
  console.log(`${error}`)
  // Todo: Add a handler.
})
