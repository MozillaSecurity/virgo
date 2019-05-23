/** @format */

import React from 'react'
import PropTypes from 'prop-types'

/* Styles */
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import DarkIcon from '@material-ui/icons/Brightness2'
import LightIcon from '@material-ui/icons/BrightnessLow'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({})

const DarkmodeSwitch = props => {
  const { label1, label2, checked, onChange } = props
  return (
    <React.Fragment>
      <ListItemIcon>{checked ? <LightIcon /> : <DarkIcon />}</ListItemIcon>
      <ListItemText
        primary={checked ? label1 : label2}
        primaryTypographyProps={{ variant: 'body2' }}
      />
      <ListItemSecondaryAction>
        <Switch checked={checked} onChange={onChange} />
      </ListItemSecondaryAction>
    </React.Fragment>
  )
}

DarkmodeSwitch.defaultProps = {
  label1: 'Light Mode',
  label2: 'Dark Mode'
}

DarkmodeSwitch.propTypes = {
  label1: PropTypes.string,
  label2: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default withStyles(styles)(DarkmodeSwitch)
