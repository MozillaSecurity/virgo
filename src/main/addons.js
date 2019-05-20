/** @format */

import logger from 'electron-log'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } from 'electron-devtools-installer'

const toolMap = {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF
}

// eslint-disable-next-line import/prefer-default-export
export const installDeveloperTools = tools => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  tools.map(async toolName => {
    try {
      const name = await installExtension(toolMap[toolName], forceDownload)
      logger.info(`Added extension: ${name}`)
    } catch (error) {
      logger.info(`An error occurred: ${error}`)
    }
  })
}
