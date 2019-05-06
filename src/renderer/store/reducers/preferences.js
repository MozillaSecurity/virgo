/** @format */

/* Redux Reducers */

const preferences = (state = {}, action) => {
  switch (action.type) {
    case 'PREF_DARKMODE':
      return {
        ...state,
        darkMode: !state.darkMode
      }
    case 'PREF_VIBRANCE':
      return {
        ...state,
        vibrance: !state.vibrance
      }
    case 'PREF_RESTORE_WINDOW_SIZE':
      return {
        ...state,
        restoreWindowSize: !state.restoreWindowSize
      }
    case 'PREF_ALWAYS_ON_TOP':
      return {
        ...state,
        alwaysOnTop: !state.alwaysOnTop
      }
    case 'PREF_UPDATE_TASK_URL':
      return {
        ...state,
        taskURL: action.value
      }
    default:
      return state
  }
}

export default preferences
