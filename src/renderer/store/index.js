/** @format */
/*
 * The Store of Redux.
 * Each state in the app is maintained from this single store of truth.
 */
import { createStore, compose } from 'redux'
import Store from 'electron-store'

/* Combined Redux Reducers */
import rootReducer from './reducers'
import FuzzManagerConf from '../../shared/fuzzmanager'
import Logger from '../../shared/logger'

const logger = new Logger('Store')

export const saveState = (state, store) => {
  try {
    store.set(state)
  } catch (error) {
    logger.error(error)
    return false
  }
  return true
}

export const initState = () => {
  const persistentStore = new Store()

  /* Initial write of FuzzManager configuration with default values. */
  const fuzzmanagerconf = new FuzzManagerConf({
    configName: 'fuzzmanagerconf',
    defaults: persistentStore.store.preferences.backend.fuzzmanager
  })
  if (!fuzzmanagerconf.exists()) {
    fuzzmanagerconf.saveFile()
  } else {
    fuzzmanagerconf.readFile()
    persistentStore.store.preferences.backend.fuzzmanager = fuzzmanagerconf.data
  }

  /* eslint-disable no-underscore-dangle */
  const enhancers = compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  /* Hydrate */
  const store = createStore(rootReducer, Object.assign({}, persistentStore.store), enhancers)

  store.subscribe(() => {
    saveState(store.getState(), persistentStore)
  })
  return store
}
