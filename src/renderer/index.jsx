/** @format */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import './styles/fontface-roboto.css'

import App from './containers/App'
import GlobalStateStore from './store'

const styles = theme => ({
  '@global': {
    '*, *::after, *::before': {
      userSelect: 'none',
      userDrag: 'none',
      cursor: 'default !important'
    }
  }
})

const AppWithStyles = withStyles(styles)(App)

ReactDOM.render(
  //<React.StrictMode>
  <Provider store={GlobalStateStore}>
    <AppWithStyles />
  </Provider>,
  //</React.StrictMode>,
  document.getElementById('parcel-root')
)
