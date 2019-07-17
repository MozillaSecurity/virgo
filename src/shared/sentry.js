/** @format */

import * as Sentry from '@sentry/electron'

import Store from '../main/store'
import Logger from './logger'

const logger = new Logger('Sentry')

/**
 * Sentry initialization for renderer and main process.
 */
logger.info(`Initializing Sentry for process: ${process.type}`)
Sentry.init({
  dsn: Store.get('preferences.sentry.dsn'),
  environment: process.env.NODE_ENV,
  // eslint-disable-next-line no-unused-vars
  onFatalError: error => {
    process.exit(1)
  }
})

export default Sentry
