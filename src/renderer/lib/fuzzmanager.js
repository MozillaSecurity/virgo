/** @format */
import fs from 'fs'

import ini from 'ini'
import ElectronFileHandler from './file'

class FuzzManagerConf extends ElectronFileHandler {
  saveFile = () => {
    fs.writeFileSync(this.path, ini.stringify(this.data, { section: 'Main' }))
  }

  readFile = () => {
    this.data = ini.parse(fs.readFileSync(this.path, 'utf-8'))
    this.data = this.data.Main
    return this.data
  }
}

export default FuzzManagerConf
