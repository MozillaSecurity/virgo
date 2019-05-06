/** @format */

import React from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'
import PropTypes from 'prop-types'

/* Styles */
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import Reset from '@material-ui/core/CssBaseline'
import '../../styles/fontface-roboto.css'

/* Custom UI Themes */
import themeDark from './Dark'
import themeLight from './Light'
import themeVibrance from './Vibrancy'

const styles = () => ({
  '@global': {
    '*, *::after, *::before': {
      userSelect: 'none',
      userDrag: 'none',
      cursor: 'default !important'
    }
  }
})

const ThemeProvider = props => {
  const { toggleDarkMode, toggleVibrance, children } = props

  let theme = themeLight
  if (toggleVibrance && toggleDarkMode) {
    remote.getCurrentWindow().setVibrancy('dark')
    theme = themeVibrance
  }
  if (!toggleVibrance && toggleDarkMode) {
    remote.getCurrentWindow().setVibrancy('')
    theme = themeDark
  }

  return (
    <MuiThemeProvider theme={createMuiTheme(theme)}>
      <Reset />
      {children}
    </MuiThemeProvider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  toggleDarkMode: PropTypes.bool.isRequired,
  toggleVibrance: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return {
    toggleDarkMode: state.preferences.darkMode,
    toggleVibrance: state.preferences.vibrance
  }
}

export default withStyles(styles)(connect(mapStateToProps)(ThemeProvider))
