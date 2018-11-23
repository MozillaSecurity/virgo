/** @format */
import { Tray, Menu } from 'electron'
import { resolve } from 'app-root-path'

const isMacOS = process.platform === 'darwin'

export default function createTray(window) {
  let tray = new Tray(resolve('build/icons/16x16.png'))

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Settings'
    },
    {
      label: 'Hide Window',
      click: () => {
        window.isVisible() ? window.hide() : window.show()
      }
    },
    {
      label: 'Toggle DevTools',
      accelerator: isMacOS ? 'Option+Command+I' : 'Alt+Command+I',
      click: () => {
        window.show()
        window.toggleDevTools()
      }
    },
    {
      label: 'Quit',
      accelerator: isMacOS ? 'Command+Q' : 'Ctrl+Q',
      selector: 'terminate:'
    }
  ])

  tray.setToolTip('Virgo')
  tray.setContextMenu(trayMenu)

  return tray
}
