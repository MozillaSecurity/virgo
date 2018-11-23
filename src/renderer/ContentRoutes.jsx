/** @format */

import React from 'react'
import { Route, Switch } from 'react-router-dom'

import DashboardPage from './containers/Dashboard'
import ActivityPage from './containers/Activity'
import PreferencesPage from './containers/Preferences'

export const ROUTES_ITEMS = [
  {
    to: '/',
    exact: true,
    component: DashboardPage,
    text: 'Dashboard'
  },
  {
    to: '/activity',
    exact: true,
    component: ActivityPage,
    text: 'Activity'
  },
  {
    to: '/preferences',
    exact: true,
    component: PreferencesPage,
    text: 'Preferences'
  },
  {
    to: '*',
    component: DashboardPage
  }
]

const ROUTES = ROUTES_ITEMS.map(route => (
  <Route key={route.to} path={route.to} exact={route.exact} component={route.component} />
))

export default class ContentRoutes extends React.Component {
  render() {
    return <Switch>{ROUTES}</Switch>
  }
}
