/** @format */
/*
 * The Store of Redux.
 * Each state in the app is maintained from this single store of truth.
 */
import { createStore } from 'redux'
import electronStore from 'electron-store'

import reducer from './reducers'

// Initialize the Redux store with the electron-store configuration.
let electronPreferences = new electronStore()

let initialState = Object.assign(electronPreferences.store, {
  imageDefinitions: []
})

const store = createStore(reducer, initialState)

export default store
