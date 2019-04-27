/** @format */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import './styles/fontface-roboto.css'

import App from './containers/App'
import { initStore } from './store'

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
  <Provider store={initStore()}>
    <AppWithStyles />
  </Provider>,
  document.getElementById('parcel-root')
)
