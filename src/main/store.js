/** @format */

import Store from 'electron-store'
import { defaultsDeep } from 'lodash'

import { Environment, JS } from '../shared/common'
import Logger from '../shared/logger'

const logger = new Logger('Preferences')

const defaults = {
  preferences: {
    darkMode: true,
    vibrance: false,
    restoreWindowSize: true,
    alwaysOnTop: false,
    winBounds: {
      x: null,
      y: null,
      width: 940,
      height: 780
    },
    taskURL: 'https://virgo-tasks.herokuapp.com/tasks',
    contactEmail: 'fuzzing@mozilla.com',
    earlyReleases: false,
    backend: {
      fuzzmanager: {
        serverhost: 'virgo-f.fuzzing.mozilla.org',
        serverport: 443,
        serverproto: 'https',
        serverauthtoken: '13374cc355',
        clientid: ''
      }
    },
    sentry: {
      dsn: 'https://165a946fbc3445aea4091b5e704e6a09@sentry.io/1459621'
    }
  }
}

/*
A new Virgo release might deprecate or introduce new settings.
* If we deprecate settings, then we need to detect those obsolete settings and remove them from
  the user's settings.
* If we introduce settings, then we need to merge those new settings but keep the user's set values
  for existing and non obsolete settings.
*/

const store = new Store({ defaults })

const migratePrefs = () => {
  const obsoletePrefs = JS.compareJSON(store.store.preferences, defaults.preferences)
  if (obsoletePrefs.length > 0) {
    logger.warning(
      'The following prefs are removed from your preferences because they are obsolete:'
    )
    logger.warning(JSON.stringify(obsoletePrefs))
    try {
      obsoletePrefs.forEach(pref => {
        logger.debug(`preferences.${pref}`)
        store.delete(`preferences.${pref}`)
      })
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
  }

  logger.warning('We now migrate newly added preferences to your existing preferences.')
  store.set(defaultsDeep(store.store, defaults))

  logger.info('Update done.')
}

if (Environment.isMainProcess) {
  migratePrefs()
}

export default store
