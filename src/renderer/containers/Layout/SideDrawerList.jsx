/** @format */

import React from 'react'
import { Link } from 'react-router-dom'

/* Styles */
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

/* Custom UI */
import DashboardIcon from '@material-ui/icons/Dashboard'
import ActivityIcon from '@material-ui/icons/Report'
import SettingsIcon from '@material-ui/icons/Build'

const DashboardLink = props => <Link to="/" {...props} />
const ActivityLink = props => <Link to="/activity" {...props} />
const PreferencesLink = props => <Link to="/preferences" {...props} />

const SideDrawerList = () => {
  return (
    <List>
      <ListItem button component={DashboardLink}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" primaryTypographyProps={{ variant: 'body2' }} />
      </ListItem>
      <ListItem button component={ActivityLink}>
        <ListItemIcon>
          <ActivityIcon />
        </ListItemIcon>
        <ListItemText primary="Activity" primaryTypographyProps={{ variant: 'body2' }} />
      </ListItem>
      <ListItem button component={PreferencesLink}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Preferences" primaryTypographyProps={{ variant: 'body2' }} />
      </ListItem>
    </List>
  )
}

export default SideDrawerList
