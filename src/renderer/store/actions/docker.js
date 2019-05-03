/** @format */

/* Redux Actions */

export const setImageError = value => ({
  type: 'IMAGE_ERROR',
  error: value
})

export const setContainerError = value => ({
  type: 'CONTAINER_ERROR',
  error: value
})

export const setImageDefinitions = value => ({
  type: 'IMAGE_DEFINITIONS',
  definitions: value
})

export const setContainerData = value => ({
  type: 'CONTAINER_DATA',
  containerData: value
})

export const setContainer = value => ({
  type: 'CONTAINER',
  container: value
})

export const setStatus = value => ({
  type: 'SET_STATUS',
  status: value
})

export const reset = () => ({
  type: 'RESET'
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_STOPPED: 'SHOW_STOPPED',
  SHOW_RUNNING: 'SHOW_RUNNING'
}
