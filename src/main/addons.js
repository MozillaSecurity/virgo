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
  REACT_DEVELOPER_TOOLS: REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS: REDUX_DEVTOOLS,
  REACT_PERF: REACT_PERF,
  MOBX_DEVTOOLS: MOBX_DEVTOOLS,
  APOLLO_DEVELOPER_TOOLS: APOLLO_DEVELOPER_TOOLS
}

export const installDeveloperTools = tools => {
  tools.map(async toolName => {
    try {
      let name = await installExtension(toolMap[toolName])
      logger.info(`Added extension: ${name}`)
    } catch (error) {
      logger.info(`An error occurred: ${error}`)
    }
  })
}
