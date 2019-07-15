/** @format */

import { Tray, Menu } from 'electron'
import { resolve } from 'app-root-path'

import { Environment, JS } from '../shared/common'

export default function createTray(window) {
  let template = [
    {
      label: 'Settings'
    },
    {
      label: 'Toggle Window',
      click: () => {
        // eslint-disable-next-line no-unused-expressions
        window.isVisible() ? window.hide() : window.show()
      }
    },
    {
      label: 'Quit',
      accelerator: Environment.isMacOS ? 'Command+Q' : 'Ctrl+Q',
      selector: 'terminate:'
    }
  ]

  if (Environment.isDevelopment) {
    template = JS.insert(template, 1, {
      label: 'Toggle DevTools',
      accelerator: Environment.isMacOS ? 'Option+Command+I' : 'Alt+Command+I',
      click: () => {
        window.show()
        window.toggleDevTools()
      }
    })
  }

  const tray = new Tray(resolve('resources/build/icons/16x16.png'))
  tray.setToolTip('Virgo')
  tray.setContextMenu(Menu.buildFromTemplate(template))

  return tray
}
