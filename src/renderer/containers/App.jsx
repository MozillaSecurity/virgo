/** @format */

import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import ContentRoutes from './ContentRoutes'
import SideDrawer from './Layout/SideDrawer'
import SideDrawerList from './Layout/SideDrawerList'
import ThemeProvider from './Themes/ThemeProvider'
import { initState } from '../store'

const App = () => {
  return (
    <Provider store={initState()}>
      <ThemeProvider>
        <HashRouter>
          <SideDrawer items={SideDrawerList()}>
            <ContentRoutes />
          </SideDrawer>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
