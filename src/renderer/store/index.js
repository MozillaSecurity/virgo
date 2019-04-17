/** @format */
/*
 * The Store of Redux.
 * Each state in the app is maintained from this single store of truth.
 */
import { createStore } from 'redux'
import electronStore from 'electron-store'

import reducer from './reducers'

export const loadState = (name = 'state') => {
  try {
    const serializeState = localStorage.getItem(name)
    // Private Browsing
    if (serializeState === null) {
      return undefined
    }
    return JSON.parse(serializeState)
  } catch (error) {
    return undefined
  }
}

export const saveState = (state, name = 'state') => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(name, serializedState)
  } catch (error) {
    return false
  }
  return true
}

export const initStore = () => {
  // Initialize the Redux store with the electron-store configuration.
  const electronPreferences = new electronStore()
  let initialState = Object.assign(electronPreferences.store, {
    imageDefinitions: []
  })

  const persistedState = loadState()
  initialState = Object.assign(initialState, persistedState)

  const store = createStore(reducer, initialState)

  store.subscribe(() => {
    saveState(store.getState())
  })
  return store
}
