/** @format */
export const appDefinition = require('../../package.json')

export const isDevEnvironment = () => {
  if ('ELECTRON_IS_DEV' in process.env) {
    return parseInt(process.env.ELECTRON_IS_DEV, 10) === 1
  } else {
    return process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath)
  }
}
