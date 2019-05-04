/** @format */
import electron from 'electron'

export const appDefinition = require('../../package.json')

export class Environment {
  static isPackaged = () => {
    return (electron.app || electron.remote.app).isPackaged
  }

  static isTest = () => {
    return process.env.NODE_ENV === 'test'
  }

  static isProduction = () => {
    return process.env.NODE_ENV === 'production'
  }

  static isDevelopment = () => {
    return process.env.NODE_ENV === 'development'
  }
}
