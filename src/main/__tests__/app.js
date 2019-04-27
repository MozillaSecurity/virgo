/** @format */

import { Application } from 'spectron'
import { resolve } from 'app-root-path'

export default () =>
  new Application({
    path: resolve(`./node_modules/.bin/electron${process.platform === 'win32' ? '.cmd' : ''}`),
    args: [resolve('.')],
    env: {
      NODE_ENV: 'test'
    }
  })
