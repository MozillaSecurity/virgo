/** @format */

import fs from 'fs'
import path from 'path'

import electron from 'electron'

class ElectronFileHandler {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')

    this.path = path.join(userDataPath, opts.configName)
    this.data = opts.defaults
  }

  get(key) {
    return this.data[key]
  }

  set(key, value) {
    this.data[key] = value
  }

  exists = () => {
    return fs.existsSync(this.path)
  }

  saveFile = () => {
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }

  readFile = () => {
    this.data = JSON.parse(this.readFileSync(this.path))
  }
}

export default ElectronFileHandler
