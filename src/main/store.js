/** @format */

import Store from 'electron-store'

const defaults = {
  preferences: {
    darkMode: true,
    vibrance: false,
    restoreWindowSize: true,
    alwaysOnTop: false,
    winBounds: {},
    taskURL: 'http://localhost:8081/tasks',
    contactEmail: 'fuzzing@mozilla.com',
    earlyReleases: false
  }
}

export default new Store({ defaults })
