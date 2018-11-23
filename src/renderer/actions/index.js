/** @format */

export const setDarkMode = value => ({ type: 'PREF_DARKMODE', darkMode: value })
export const setRestoreWindowSize = value => ({ type: 'PREF_RESTORE_WINDOW_SIZE', restoreWindowSize: value })

/* Docker IPC */
export const setImageDefinitions = value => ({ type: 'IMAGE_DEFINITIONS', imageDefinitions: value })
export const setImageError = value => ({ type: 'IMAGE_ERROR', error: value })
export const setContainerError = value => ({ type: 'CONTAINER_ERROR', error: value })
export const setContainerData = value => ({ type: 'CONTAINER_DATA', containerData: value })
export const setContainer = value => ({ type: 'CONTAINER', container: value })
