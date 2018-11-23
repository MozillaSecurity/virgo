/** @format */

import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'

autoUpdater.logger = logger
autoUpdater.logger.transports.file.level = 'info'

export default autoUpdater
