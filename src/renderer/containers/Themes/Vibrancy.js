/** @format */
import { merge } from 'lodash'

import themeDark from './Dark'

const vibrancyTheme = merge({}, themeDark, {
  palette: {
    background: 'transparent'
  },
  overrides: {
    MuiToolbar: {
      root: {
        background: 'transparent !important'
      }
    },
    MuiAppBar: {
      colorPrimary: {
        background: 'transparent !important'
      }
    }
  },
  drawer: {
    background: 'rgba(40, 44, 52, 0.8)'
  },
  statusBar: {
    background: 'rgba(40, 44, 52, 0.4)'
  },
  tableBar: {
    background: 'rgba(40, 44, 52, 0.8)'
  }
})

export default vibrancyTheme
