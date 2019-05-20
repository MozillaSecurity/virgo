/** @format */
import electron from 'electron'
import { resolve } from 'app-root-path'

export const Package = require(resolve('./package.json'))

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
}

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
}
