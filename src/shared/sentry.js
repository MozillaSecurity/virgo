/** @format */

import * as Sentry from '@sentry/electron'

import { Environment } from './common'
import Store from '../main/store'
import Logger from './logger'

const logger = new Logger('Sentry')

/**
 * Sentry initialization for renderer and main process.
 */
if (Environment.isDevelopment || Environment.isProduction) {
  Sentry.init({
    dsn: Store.get('preferences.sentry.dsn'),
    environment: process.env.NODE_ENV,
    // eslint-disable-next-line no-unused-vars
    onFatalError: error => {
      process.exit(1)
    }
  })
  logger.info(`Sentry initialized for process: ${process.type}`)
}

export default Sentry
