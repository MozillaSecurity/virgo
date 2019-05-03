/** @format */

import React from 'react'
import { Route, Switch } from 'react-router-dom'

/* Pages */
import DashboardPage from './Dashboard'
import ActivityPage from './Activity'
import PreferencesPage from './Preferences'

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

const ContentRoutes = () => {
  return <Switch>{ROUTES}</Switch>
}

export default ContentRoutes
