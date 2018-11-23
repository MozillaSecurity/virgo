/** @format */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import themeDark from './Dark'
import themeLight from './Light'

class ThemeProvider extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(this.props.darkMode ? themeDark : themeLight)}>
        {this.props.children}
      </MuiThemeProvider>
    )
  }
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  darkMode: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return { darkMode: state.darkMode }
}

export default connect(mapStateToProps)(ThemeProvider)
