/** @format */

import React from 'react'
import { HashRouter } from 'react-router-dom'
import Reset from '@material-ui/core/CssBaseline'

import SideDrawer from './Layout/SideDrawer'
import SideDrawerList from './Layout/SideDrawerList'
import ThemeProvider from './Themes/ThemeProvider'
import ContentRoutes from '../ContentRoutes'

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider>
        <Reset />
        <HashRouter>
          <SideDrawer items={SideDrawerList()}>
            <ContentRoutes />
          </SideDrawer>
        </HashRouter>
      </ThemeProvider>
    )
  }
}
