/** @format */
import _ from 'lodash'

import themeBase from './Base'

const darkTheme = _.merge(
  {
    palette: {
      type: 'dark',
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
          backgroundColor: '#242424',
          color: '#c8c8c8'
        }
      },
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: '#242424'
        }
      }
    }
  },
  themeBase
)

export default darkTheme
