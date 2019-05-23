/** @format */

import React from 'react'
import PropTypes from 'prop-types'

/* Styles */
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import RefreshIcon from '@material-ui/icons/Refresh'
import StopIcon from '@material-ui/icons/Stop'
import FilterListIcon from '@material-ui/icons/FilterList'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
    background: theme.tableBar.background
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: '0 0 auto'
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'flex-end',
    flex: '1 1 30%'
  }
})

const EnhancedTableToolbar = props => {
  const {
    classes,
    numSelected,
    title,
    onRemoveCallback,
    onStopCallback,
    onRefreshListCallback,
    onFilterListCallback
  } = props

  return (
    <Toolbar className={`${classes.root} ${numSelected > 0 ? classes.highlight : ''} `}>
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <React.Fragment>
            {onStopCallback && (
              <Tooltip title="Stop Container">
                <IconButton aria-label="Stop container" onClick={onStopCallback}>
                  <StopIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Remove">
              <IconButton aria-label="Remove" onClick={onRemoveCallback}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Tooltip title="Refresh List">
              <IconButton aria-label="Filter list" onClick={onRefreshListCallback}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter List">
              <IconButton aria-label="Filter list" onClick={onFilterListCallback}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        )}
      </div>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onRemoveCallback: PropTypes.func.isRequired,
  onRefreshListCallback: PropTypes.func.isRequired,
  onFilterListCallback: PropTypes.func,
  onStopCallback: PropTypes.func
}

export default withStyles(styles)(EnhancedTableToolbar)
