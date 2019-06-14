/** @format */

import Store from 'electron-store'

const defaults = {
  preferences: {
    darkMode: true,
    vibrance: false,
    restoreWindowSize: true,
    alwaysOnTop: false,
    winBounds: {},
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
    }
  }
}

export default new Store({ defaults })
