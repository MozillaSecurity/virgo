/** @format */

/* Redux Actions */

export const toggleDarkMode = () => ({
  type: 'PREF_DARKMODE'
})

export const toggleVibrance = () => ({
  type: 'PREF_VIBRANCE'
})

export const toggleRestoreWindowSize = () => ({
  type: 'PREF_RESTORE_WINDOW_SIZE'
})

export const toggleAlwaysOnTop = () => ({
  type: 'PREF_ALWAYS_ON_TOP'
})

export const updateTaskURL = value => ({
  type: 'PREF_UPDATE_TASK_URL',
  value
})

export const updateContactEmail = value => ({
  type: 'PREF_UPDATE_CONTACT_EMAIL',
  value
})

export const toggleEarlyReleases = () => ({
  type: 'PREF_EARLY_RELEASES_UPDATE'
})
