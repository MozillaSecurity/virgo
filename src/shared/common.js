/** @format */
import electron from 'electron'
import { resolve } from 'app-root-path'
import { transform, isEqual, isEqualWith, isObject } from 'lodash'

// eslint-disable-next-line import/no-dynamic-require,global-require
export const Package = require(resolve('./package.json'))

/**
 * Common referenced environment functions in renderer and main.
 *
 * @class Environment
 */
export class Environment {
  static get isPackaged() {
    return (electron.app || electron.remote.app).isPackaged
  }

  static get isTest() {
    return process.env.NODE_ENV === 'test'
  }

  static get isProduction() {
    return process.env.NODE_ENV === 'production'
  }

  static get isDevelopment() {
    return process.env.NODE_ENV === 'development'
  }

  static get isMacOS() {
    return process.platform === 'darwin'
  }

  static get isWindows() {
    return process.platform === 'win32'
  }

  static get isLinux() {
    return process.platform === 'linux'
  }

  static get isMainProcess() {
    return process.type === 'browser'
  }

  static get isRendererProcess() {
    return process.type === 'renderer'
  }

  static get developmentURL() {
    const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
    const PORT = parseInt(process.env.PORT || '', 10) || 3000
    const HOST = process.env.HOST || '127.0.0.1'
    return `${PROTOCOL}://${HOST}:${PORT}`
  }
}

/**
 * Javascript utility class for common or missing built-in operations.
 *
 * @class JS
 */
export class JS {
  static insert(array, index, ...newItems) {
    return [
      // Part of the Array before the specified index.
      ...array.slice(0, index),
      // Inserted items.
      ...newItems,
      // Part of the Array after the specified index.
      ...array.slice(index)
    ]
  }

  /**
   * Deep diff between two objects, returning missing objects as dot notation.
   * @param {Object} base Object compared
   * @param {Object} object Object to compare with
   * @returns {Array} Missing objects as strings in dot notation.
   */
  static compareJSON = (base, object) => {
    const result = []

    // eslint-disable-next-line no-shadow
    const compare = (base, object, crumbs = '') => {
      Object.keys(base).forEach(k => {
        switch (typeof base[k]) {
          case 'object':
            /* Object does not exist anymore in new prefs. */
            if (!Object.prototype.hasOwnProperty.call(object, k)) {
              result.push(crumbs ? `${crumbs}.${k}` : k)
            } else if (base[k]) {
              /* Repeat for nested objects. */
              compare(base[k], object[k], crumbs ? `${crumbs}.${k}` : k)
            }
            break
          default:
            /* Pref does not exist anymore in new preferences. */
            if (!Object.keys(object).includes(k)) {
              result.push(`${crumbs}.${k}`)
            }
        }
      })
    }

    compare(base, object)
    return result
  }

  /**
   * Deep diff between two objects using lodash
   * @param {Object} object Object compared
   * @param {Object} base Object to compare with
   * @param {Function} customizer Optional customizer function
   * @return {Object} Return a new object who represent the diff
   */
  static difference(object, base, customizer = null) {
    return transform(object, (result, value, key) => {
      if (!isEqualWith(value, base[key], customizer || {})) {
        // eslint-disable-next-line no-param-reassign
        result[key] =
          isObject(value) && isObject(base[key])
            ? JS.difference(value, base[key], customizer)
            : value
      }
    })
  }

  // eslint-disable-next-line consistent-return
  static customizer(baseValue, value) {
    if (Array.isArray(baseValue) && Array.isArray(value)) {
      return isEqual(baseValue.sort(), value.sort())
    }
  }
}
