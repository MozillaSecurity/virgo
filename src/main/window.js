/** @format */
import * as url from 'url'
import { BrowserWindow } from 'electron'
import { resolve } from 'app-root-path'

import { isDevEnvironment } from './common'
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
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default'
  }
  // Restore window size and position.
  if (Store.get('restoreWindowSize') === true) {
    windowOpts = Object.assign(windowOpts, Store.get('winBounds'))
  }

  let mainWindow = new BrowserWindow(windowOpts)

  const appUrl = isDevEnvironment()
    ? `${PROTOCOL}://${HOST}:${PORT}`
    : url.format({
        pathname: resolve('dist/renderer/production/index.html'),
        protocol: 'file:',
        slashes: true
      })

  mainWindow.loadURL(appUrl)
  if (isDevEnvironment()) {
    ;(async () => {
      const addons = await import('./addons')
      addons.installDeveloperTools(['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'])
    })()
  }

  mainWindow.on('close', () => {
    // Save window size and position.
    Store.set('winBounds', mainWindow.getBounds())
  })

  mainWindow.on('closed', () => {
    // Dereference the window objects.
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
