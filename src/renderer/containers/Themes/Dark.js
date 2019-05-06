/** @format */
import { merge } from 'lodash'

import themeBase from './Base'

const darkTheme = merge(
  {
    shadows: Array(25).fill('none'),
    palette: {
      type: 'dark',
      background: {
        default: '#1e2022'
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
          backgroundColor: '#1e2022',
          color: '#c8c8c8'
        }
      },
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: '#1e2022',
          boxShadow: 'none'
        }
      }
    },
    drawer: {
      background: '#1e2022'
    },
    statusBar: {
      background: '#2a2d2f'
    }
  },
  themeBase
)

export default darkTheme
