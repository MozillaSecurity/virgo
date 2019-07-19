/** @format */

import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

// eslint-disable-next-line no-unused-vars
import Sentry from '../../shared/sentry'
import ContentRoutes from './ContentRoutes'
import SideDrawer from './Layout/SideDrawer'
import SideDrawerList from './Layout/SideDrawerList'
import ThemeProvider from './Themes/ThemeProvider'
import { initState } from '../store'
import ErrorBoundary from '../components/Error/ErrorBoundary'

const App = () => {
  return (
    <Provider store={initState()}>
      <ThemeProvider>
        <HashRouter>
          <ErrorBoundary>
            <SideDrawer items={SideDrawerList()}>
              <ContentRoutes />
            </SideDrawer>
          </ErrorBoundary>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
