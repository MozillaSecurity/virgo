/** @format */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
/* Styles */
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import { remote } from 'electron'

import themeDark from './Dark'
import themeLight from './Light'

class ThemeProvider extends React.Component {
  adjustIfVibrance = (theme, darkMode, vibrance) => {
    /* eslint-disable no-param-reassign */
    if (darkMode && vibrance) {
      theme.palette.background = 'transparent'
      theme.overrides.MuiToolbar.root.background = 'transparent !important'
      theme.overrides.MuiAppBar.colorPrimary.background = 'transparent !important'
      remote.getCurrentWindow().setVibrancy('dark')
    } else {
      delete theme.palette.background
      delete theme.overrides.MuiToolbar.root.background
      delete theme.overrides.MuiAppBar.colorPrimary.background
    }
  }

  render() {
    const { darkMode, vibrance, children } = this.props

    this.adjustIfVibrance(themeDark, darkMode, vibrance)

    return <MuiThemeProvider theme={createMuiTheme(darkMode ? themeDark : themeLight)}>{children}</MuiThemeProvider>
  }
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  darkMode: PropTypes.bool.isRequired,
  vibrance: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return {
    darkMode: state.preferences.darkMode,
    vibrance: state.preferences.vibrance
  }
}

export default connect(mapStateToProps)(ThemeProvider)
