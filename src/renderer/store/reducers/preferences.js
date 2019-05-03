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
    default:
      return state
  }
}

export default preferences
