/** @format */

import * as url from 'url'
import { BrowserWindow, app } from 'electron'
import { resolve } from 'app-root-path'

import { Environment } from '../common'
import Store from '../store'

export default function createMainWindow() {
  const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
  const PORT = parseInt(process.env.PORT || '', 10) || 3000
  const HOST = process.env.HOST || '127.0.0.1'

  // Window options.
  let windowOpts = {
    autoHideMenuBar: true,
    frame: false,
    minWidth: 940,
    minHeight: 780,
    show: false,
    alwaysOnTop: Store.get('preferences.alwaysOnTop'),
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    webPreferences: {
      nodeIntegration: true,
      preload: resolve('src/main/sentry.js')
    }
  }

  // Restore window size and position.
  if (Store.get('preferences.restoreWindowSize') === true) {
    windowOpts = Object.assign(windowOpts, Store.get('preferences.winBounds'))
  }

  let mainWindow = new BrowserWindow(windowOpts)

  const appUrl =
    Environment.isPackaged || Environment.isTest
      ? url.format({
          pathname: resolve('build/app/renderer/production/index.html'),
          protocol: 'file:',
          slashes: true
        })
      : `${PROTOCOL}://${HOST}:${PORT}`

  mainWindow.loadURL(appUrl)

  if (Environment.isDevelopment) {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
    ;(async () => {
      const addons = await import('../addons')
      addons.installDeveloperTools(['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'])
    })()
  }

  /*
   * This event is usually emitted after the did-finish-load event, but for pages with many
   * remote resources, it may be emitted before the did-finish-load event.
   * mainWindow.once('ready-to-show', () => {})
   */
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('mainWindow is not defined.')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  mainWindow.on('close', event => {
    // Save window size and position.
    Store.set('preferences.winBounds', mainWindow.getBounds())

    if (Environment.isMacOS) {
      if (app.quitting) {
        /* User tried to quit the app for real. */
        mainWindow = null
      } else if (mainWindow !== null) {
        /* User tried to close the window and we hide the main Window instead. */
        event.preventDefault()
        mainWindow.hide()
      }
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('unresponsive', () => {
    console.log('App became unresponsive.')
  })

  mainWindow.webContents.on('crashed', () => {
    console.log(`WebContents crashed.`)
  })

  return mainWindow
}
