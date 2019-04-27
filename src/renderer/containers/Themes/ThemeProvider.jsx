/** @format */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import themeDark from './Dark'
import themeLight from './Light'

class ThemeProvider extends React.Component {
  toggleVibrance(theme) {
    if (this.props.darkMode && this.props.vibrance) {
      theme.palette.background = 'transparent'
      theme.overrides.MuiToolbar.root.background = 'transparent !important'
      theme.overrides.MuiAppBar.colorPrimary.background = 'transparent !important'
      import('electron').then(electron => {
        electron.remote.getCurrentWindow().setVibrancy('dark')
      })
    } else {
      delete theme.palette.background
      delete theme.overrides.MuiToolbar.root.background
      delete theme.overrides.MuiAppBar.colorPrimary.background
    }
  }

  render() {
    this.toggleVibrance(themeDark)

    return (
      <MuiThemeProvider theme={createMuiTheme(this.props.darkMode ? themeDark : themeLight)}>
        {this.props.children}
      </MuiThemeProvider>
    )
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
