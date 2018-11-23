/** @format */

import React from 'react'
import PropTypes from 'prop-types'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import DarkIcon from '@material-ui/icons/Brightness2'
import LightIcon from '@material-ui/icons/BrightnessLow'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({})

class DarkmodeSwitch extends React.Component {
  render() {
    const { label1, label2, checked, onChange } = this.props
    return (
      <ListItem>
        <ListItemIcon>{checked ? <LightIcon /> : <DarkIcon />}</ListItemIcon>
        <ListItemText primary={checked ? label1 : label2} primaryTypographyProps={{ variant: 'body2' }} />
        <ListItemSecondaryAction>
          <Switch checked={checked} onChange={onChange()} />
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

DarkmodeSwitch.propTypes = {
  label1: PropTypes.string,
  label2: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default withStyles(styles)(DarkmodeSwitch)
