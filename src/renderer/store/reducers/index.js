/** @format */

import { combineReducers } from 'redux'
import preferences from './preferences'
import docker from './docker'

/*
 * The Reducers are the Redux dispatcher.
 * Each function is executed when a Redux action is dispatched.
 */

export default combineReducers({
  preferences,
  docker
})
