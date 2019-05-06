/** @format */

import React, { useState } from 'react'
import PropTypes from 'prop-types'

/* Styles */
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'

import DockerImages from './DockerImages'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({})

const TabContainer = ({ children }) => {
  return (
    <Typography component="div" style={{ padding: 4 * 3 }}>
      {children}
    </Typography>
  )
}

const ActivityPage = ({ classes }) => {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Paper square>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} textColor="primary">
          <Tab label="Docker Images" />
        </Tabs>
      </AppBar>
      {value === 0 && (
        <TabContainer {...classes}>
          <DockerImages />
        </TabContainer>
      )}
    </Paper>
  )
}

ActivityPage.propTypes = {
  classes: PropTypes.shape({
    children: PropTypes.node
  })
}

export default withStyles(styles)(ActivityPage)
