/** @format */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import DarkmodeSwitch from '../../components/DarkmodeSwitch'

import * as actionCreators from '../../actions'

import electronStore from 'electron-store'
let store = new electronStore()

const styles = theme => ({
  title: {
    paddingBottom: '5px'
  },
  category: {
    paddingBottom: '20px'
  }
})

class PreferencesPage extends React.Component {
  handleDarkMode = name => event => {
    this.props.setDarkMode(event.target.checked)
    store.set('darkMode', event.target.checked)
  }

  handleRestoreWindowSize = name => event => {
    this.props.setRestoreWindowSize(event.target.checked)
    store.set('restoreWindowSize', event.target.checked)
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <div className={classes.category}>
          <Typography color="primary" variant="body1" className={classes.title}>
            Appearance
          </Typography>
          <Paper>
            <List>
              <DarkmodeSwitch
                label1="Light Mode"
                label2="Dark Mode"
                onChange={this.handleDarkMode}
                checked={this.props.darkMode}
              />
            </List>
            <Divider />
            <List>
              <ListItem>
                <ListItemText primary="Restore Window Size & Position" primaryTypographyProps={{ variant: 'body2' }} />
                <ListItemSecondaryAction>
                  <Switch onChange={this.handleRestoreWindowSize()} checked={this.props.restoreWindowSize} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </div>
      </div>
    )
  }
}

/* Prop Types */
PreferencesPage.propTypes = {
  classes: PropTypes.object.isRequired,
  setDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  setRestoreWindowSize: PropTypes.func.isRequired,
  restoreWindowSize: PropTypes.bool.isRequired
}

/* States */
const mapStateToProps = state => {
  return {
    darkMode: state.darkMode,
    restoreWindowSize: state.restoreWindowSize
  }
}

/* Dispatchers */
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setDarkMode: actionCreators.setDarkMode,
      setRestoreWindowSize: actionCreators.setRestoreWindowSize
    },
    dispatch
  )
}

/* Connecto to Redux */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PreferencesPage))
