/** @format */

import * as url from 'url'
import { BrowserWindow, app } from 'electron'
import { resolve } from 'app-root-path'

import { Environment } from '../../shared/common'
import Store from '../store'
import Logger from '../../shared/logger'

const logger = new Logger('Window:Main')

export default function createMainWindow() {
  let options = {
    autoHideMenuBar: true,
    frame: false,
    minWidth: 940,
    minHeight: 780,
    show: false,
    alwaysOnTop: Store.get('preferences.alwaysOnTop'),
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    webPreferences: {
      nodeIntegration: true
    }
  }

  // Restore window size and position.
  if (Store.get('preferences.restoreWindowSize') === true) {
    options = Object.assign(options, Store.get('preferences.winBounds'))
  }

  let window = new BrowserWindow(options)

  const appUrl =
    Environment.isPackaged || Environment.isTest
      ? url.format({
          pathname: resolve('build/app/renderer/production/index.html'),
          protocol: 'file:',
          slashes: true
        })
      : Environment.developmentURL

  window.loadURL(appUrl)

  if (Environment.isDevelopment) {
    ;(async () => {
      const addons = await import('../addons')
      addons.installDeveloperTools(['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'])
    })()
  }

  /*
   * This event is usually emitted after the did-finish-load event, but for pages with many
   * remote resources, it may be emitted before the did-finish-load event.
   * window.once('ready-to-show', () => {})
   */
  window.webContents.on('did-finish-load', () => {
    if (!window) {
      throw new Error('window is not defined.')
    }
    if (process.env.START_MINIMIZED) {
      window.minimize()
    } else {
      window.show()
      window.focus()
    }
  })

  window.on('close', event => {
    // Save window size and position.
    Store.set('preferences.winBounds', window.getBounds())

    if (Environment.isMacOS) {
      if (app.quitting) {
        /* User tried to quit the app for real. */
        window = null
      } else if (window !== null) {
        /* User tried to close the window and we hide the main Window instead. */
        logger.info('Simulating App close on MacOS.')
        event.preventDefault()
        window.hide()
      }
    }
  })

  window.on('closed', () => {
    logger.info('App closed.')
    window = null
  })

  window.on('unresponsive', () => {
    logger.warn('App became unresponsive.')
  })

  window.webContents.on('crashed', () => {
    logger.error(`WebContents crashed.`)
  })

  return window
}
