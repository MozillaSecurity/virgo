/** @format */
import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core'

import axios from 'axios'
import * as actionCreators from '../../store/actions'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({})

const DockerPrefs = props => {
  const [value, setValue] = useState({
    error: false,
    status: 'The server which serves the JSON encoded task definitions.'
  })

  const updateTaskURL = URL => {
    axios
      .get(URL)
      .then(() => props.updateTaskURL(URL))
      .catch(error => setValue({ error: true, status: error.message }))
  }

  return (
    <form>
      <List>
        <ListItem>
          <TextField
            onKeyPress={event => {
              if (event.key === 'Enter') {
                updateTaskURL(event.target.value)
                event.preventDefault()
              }
            }}
            error={value.error}
            type="url"
            label="Task Definition Server"
            placeholder={props.taskURL}
            fullWidth
            helperText={value.status}
            InputLabelProps={{
              shrink: true
            }}
          />
        </ListItem>
      </List>
    </form>
  )
}

DockerPrefs.propTypes = {
  updateTaskURL: PropTypes.func.isRequired,
  taskURL: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    taskURL: state.preferences.taskURL
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateTaskURL: actionCreators.updateTaskURL
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DockerPrefs))
