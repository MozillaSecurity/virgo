/** @format */
import { merge } from 'lodash'

import themeBase from './Base'

const themeLight = merge(
  {
    palette: {
      type: 'light',
      background: {
        default: '#fafafa'
      },
      primary: {
        main: '#00bcd4'
      },
      secondary: {
        main: '#ff4081'
      }
    },
    overrides: {
      MuiToolbar: {
        root: {
          backgroundColor: '#fafafa',
          color: '#c8c8c8'
        }
      },
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: '#fafafa',
          boxShadow: 'none'
        }
      }
    },
    drawer: {
      background: '#fafafa'
    },
    statusBar: {
      background: '#fbfbfb'
    },
    tableBar: {
      background: '#efefef'
    }
  },
  themeBase
)

export default themeLight
