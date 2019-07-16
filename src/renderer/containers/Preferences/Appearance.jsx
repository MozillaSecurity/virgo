/** @format */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

/* Styles */
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'

import {Environment} from '../../../shared/common'

/* Custom UI */
import DarkmodeSwitch from '../../components/DarkmodeSwitch'

import * as actionCreators from '../../store/actions'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({})

const AppearancePrefs = props => {
  return (
    <React.Fragment>
      <List>
        <ListItem>
          <DarkmodeSwitch onChange={props.toggleDarkMode} checked={props.darkMode} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText
            primary="Restore Window Size & Position"
            primaryTypographyProps={{ variant: 'body2' }}
            secondary="The window size and position stay the same after restarts."
            secondaryTypographyProps={{ variant: 'subtitle2' }}
          />
          <ListItemSecondaryAction>
            <Switch onChange={props.toggleRestoreWindowSize} checked={props.restoreWindowSize} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText
            primary="Add Window Vibrancy"
            primaryTypographyProps={{ variant: 'body2' }}
            secondary="Adds a dark vibrancy effect to Windows. (MacOS only)"
            secondaryTypographyProps={{ variant: 'subtitle2' }}
          />
          <ListItemSecondaryAction>
            <Switch
              onChange={props.toggleVibrance}
              disabled={Environment.isLinux || Environment.isWindows}
              checked={props.vibrance}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText
            primary="Always on Top"
            primaryTypographyProps={{ variant: 'body2' }}
            secondary="The main Window will stay on top."
            secondaryTypographyProps={{ variant: 'subtitle2' }}
          />
          <ListItemSecondaryAction>
            <Switch onChange={props.toggleAlwaysOnTop} checked={props.alwaysOnTop} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </React.Fragment>
  )
}

/* Prop Types */
AppearancePrefs.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  vibrance: PropTypes.bool.isRequired,
  restoreWindowSize: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  toggleVibrance: PropTypes.func.isRequired,
  toggleRestoreWindowSize: PropTypes.func.isRequired,
  toggleAlwaysOnTop: PropTypes.func.isRequired
}

/* States */
const mapStateToProps = state => {
  return {
    darkMode: state.preferences.darkMode,
    vibrance: state.preferences.vibrance,
    restoreWindowSize: state.preferences.restoreWindowSize,
    alwaysOnTop: state.preferences.alwaysOnTop
  }
}

/* Dispatchers */
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleDarkMode: actionCreators.toggleDarkMode,
      toggleVibrance: actionCreators.toggleVibrance,
      toggleRestoreWindowSize: actionCreators.toggleRestoreWindowSize,
      toggleAlwaysOnTop: actionCreators.toggleAlwaysOnTop
    },
    dispatch
  )
}

/* Connecto to Redux */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AppearancePrefs))
