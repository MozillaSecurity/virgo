/** @format */

import React from 'react'
import PropTypes from 'prop-types'

/* Styles */
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  hide: {
    display: 'none'
  },
  root: {
    padding: '8px',
    ...theme.mixins.IconButton
  }
})

const LogoIcon = props => {
  const { classes, hide, children, ...other } = props

  return (
    <IconButton className={`${classes.root} ${hide && classes.hide}`} {...other}>
      {children}
    </IconButton>
  )
}

LogoIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  hide: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default withStyles(styles)(LogoIcon)
