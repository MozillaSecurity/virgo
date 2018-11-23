/** @format */
/*
 * The Reducer is the Redux dispatcher.
 */
const reducer = (state, action) => {
  switch (action.type) {
    case 'PREF_DARKMODE':
      return {
        ...state,
        darkMode: action.darkMode
      }
    case 'PREF_RESTORE_WINDOW_SIZE':
      return {
        ...state,
        restoreWindowSize: action.restoreWindowSize
      }
    /* Docker API IPC Actions */
    case 'IMAGE_DEFINITIONS':
      return {
        ...state,
        imageDefinitions: action.imageDefinitions
      }
    case 'IMAGE_ERROR':
      return {
        ...state,
        imageError: action.error
      }
    case 'CONTAINER_ERROR':
      return {
        ...state,
        containerError: action.error
      }
    case 'CONTAINER_DATA':
      return {
        ...state,
        containerData: action.containerData
      }
    case 'CONTAINER':
      return {
        ...state,
        container: action.container
      }
    default:
      return state
  }
}

export default reducer
