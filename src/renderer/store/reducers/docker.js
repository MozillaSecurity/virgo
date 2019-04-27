/** @format */

const docker = (state = {}, action) => {
  switch (action.type) {
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
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

export default docker
