/** @format */
import _ from 'lodash'

import themeBase from './Base'

const themeLight = _.merge(
  {
    palette: {
      type: 'light',
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
          backgroundColor: '#fefefe',
          color: '#c8c8c8'
        }
      },
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: '#fefefe'
        }
      }
    }
  },
  themeBase
)

export default themeLight
