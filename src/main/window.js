/** @format */

import * as url from 'url'
import { BrowserWindow } from 'electron'
import { resolve } from 'app-root-path'

import { Environment } from './common'
import Store from './store'

export default function createMainWindow() {
  const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
  const PORT = parseInt(process.env.PORT || '', 10) || 3000
  const HOST = process.env.HOST || '127.0.0.1'

  // Window options.
  let windowOpts = {
    autoHideMenuBar: true,
    frame: false,
    minWidth: 800,
    minHeight: 600,
    alwaysOnTop: Store.get('alwaysOnTop'),
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    webPreferences: {
      nodeIntegration: true
    }
  }

  // Restore window size and position.
  if (Store.get('restoreWindowSize') === true) {
    windowOpts = Object.assign(windowOpts, Store.get('preferences.winBounds'))
  }

  let mainWindow = new BrowserWindow(windowOpts)

  const appUrl =
    Environment.isPackaged() || Environment.isTest()
      ? url.format({
          pathname: resolve('dist/renderer/production/index.html'),
          protocol: 'file:',
          slashes: true
        })
      : `${PROTOCOL}://${HOST}:${PORT}`

  mainWindow.loadURL(appUrl)

  if (Environment.isDevelopment()) {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
    ;(async () => {
      const addons = await import('./addons')
      addons.installDeveloperTools(['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'])
    })()
  }

  mainWindow.on('close', () => {
    // Save window size and position.
    Store.set('preferences.winBounds', mainWindow.getBounds())
    mainWindow = null
  })

  mainWindow.on('unresponsive', () => {
    console.log('App became unresponsive.')
    // TODO: Add a handler.
  })

  mainWindow.webContents.on('crashed', () => {
    console.log(`WebContents crashed.`)
    // TODO: Add a handler.
  })

  return mainWindow
}
