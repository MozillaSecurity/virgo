/** @format */

import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
/* Styles */
import Reset from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'
import '../styles/fontface-roboto.css'
/* Custom UI */
import SideDrawer from './Layout/SideDrawer'
import SideDrawerList from './Layout/SideDrawerList'
import ThemeProvider from './Themes/ThemeProvider'

import ContentRoutes from '../ContentRoutes'
import { initStore } from '../store'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  '@global': {
    '*, *::after, *::before': {
      userSelect: 'none',
      userDrag: 'none',
      cursor: 'default !important'
    }
  }
})

const App = () => {
  return (
    <Provider store={initStore()}>
      <ThemeProvider>
        <Reset />
        <HashRouter>
          <SideDrawer items={SideDrawerList()}>
            <ContentRoutes />
          </SideDrawer>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default withStyles(styles)(App)
