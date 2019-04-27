/** @format */

import logger from 'electron-log'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF,
  MOBX_DEVTOOLS,
  APOLLO_DEVELOPER_TOOLS
} from 'electron-devtools-installer'

const toolMap = {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF,
  MOBX_DEVTOOLS,
  APOLLO_DEVELOPER_TOOLS
}

export const installDeveloperTools = tools => {
  tools.map(async toolName => {
    try {
      const name = await installExtension(toolMap[toolName])
      logger.info(`Added extension: ${name}`)
    } catch (error) {
      logger.info(`An error occurred: ${error}`)
    }
  })
}
