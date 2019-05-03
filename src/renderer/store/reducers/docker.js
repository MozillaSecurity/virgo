/** @format */

/* Redux Reducers */

const initialState = {
  definitions: [],
  container: {},
  containerData: [],
  status: {
    state: -1,
    text: 'Launch me!',
    showSpinner: false,
    startTime: 0,
    timeElapsed: 0
  }
}

const docker = (state = initialState, action) => {
  switch (action.type) {
    case 'IMAGE_DEFINITIONS':
      return {
        ...state,
        definitions: action.definitions
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
    case 'SET_STATUS':
      return {
        ...state,
        status: {
          ...state.status,
          ...action.status
        }
      }
    case 'RESET':
      return initialState
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

export default docker
