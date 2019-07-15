/** @format */

import log from 'electron-log'

import { Package } from './common'

/**
 * Logger that logs to file and to console.
 *
 * Locations:
 *  Linux: `~/.config/<AppName>/$logName.log`
 *  MacOS: `~/Library/Logs/<AppName>/$logName.log`
 *  Windows: `%USERPROFILE%\AppData\Roaming\<AppName>\$logName.log`
 *
 * @class Logger
 */
class Logger {
  /**
   * Logger constructor.
   *
   * @param moduleName {String} Module name of caller.
   * @param level {Number} Log level number.
   * @param logName {String} Log file name.
   */
  constructor(moduleName = 'root', level = 'info', logName = `${Package.name}.log`) {
    this.moduleName = moduleName

    this.setLogname(logName)
    this.setLevel(level)
  }

  /**
   * Log error
   *
   * @param args {any} Data that needs to be logged.
   */
  error(...args) {
    return log.error(`[${this.moduleName}]`, ...args)
  }

  /**
   * Log warn
   *
   * @param args {any} Data that needs to be logged.
   */
  warning(...args) {
    return log.warn(`[${this.moduleName}]`, ...args)
  }

  /**
   * Log info
   *
   * @param args {any} Data that needs to be logged.
   */
  info(...args) {
    return log.info(`[${this.moduleName}]`, ...args)
  }

  /**
   * Log verbose
   *
   * @param args {any} Data that needs to be logged.
   */
  verbose(...args) {
    return log.verbose(`[${this.moduleName}]`, ...args)
  }

  /**
   * Log debug
   *
   * @param args {any} Data that needs to be logged.
   */
  debug(...args) {
    return log.debug(`[${this.moduleName}]`, ...args)
  }

  /**
   * Log name
   *
   * @param name {string} Filename of the logfile.
   */
  // eslint-disable-next-line class-methods-use-this
  setLogname(name) {
    log.transports.file.fileName = name
  }

  /**
   * Log level
   *
   * @param level {number} Log level number.
   */
  // eslint-disable-next-line class-methods-use-this
  setLevel(level) {
    log.transports.file.level = level
    log.transports.console.level = level
  }
}

export default Logger
