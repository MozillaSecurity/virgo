/** @format */

import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import ContentRoutes from './ContentRoutes'
import SideDrawer from './Layout/SideDrawer'
import SideDrawerList from './Layout/SideDrawerList'
import ThemeProvider from './Themes/ThemeProvider'
import { initState } from '../store'
import ErrorBoundary from '../components/Error/ErrorBoundary'

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={initState()}>
        <ThemeProvider>
          <HashRouter>
            <SideDrawer items={SideDrawerList()}>
              <ContentRoutes />
            </SideDrawer>
          </HashRouter>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
