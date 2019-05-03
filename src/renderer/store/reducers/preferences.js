/** @format */

/* Redux Reducers */

const preferences = (state = {}, action) => {
  switch (action.type) {
    case 'PREF_DARKMODE':
      return {
        ...state,
        darkMode: action.darkMode
      }
    case 'PREF_VIBRANCE':
      return {
        ...state,
        vibrance: action.vibrance
      }
    case 'PREF_RESTORE_WINDOW_SIZE':
      return {
        ...state,
        restoreWindowSize: action.restoreWindowSize
      }
    default:
      return state
  }
}

export default preferences
