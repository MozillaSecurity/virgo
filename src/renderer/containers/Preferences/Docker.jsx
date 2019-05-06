/** @format */
import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'

const DockerPrefs = props => {
  return (
    <React.Fragment>
      <List>
        <ListItem>
          <TextField
            label="Task Definition Server"
            placeholder="https://"
            fullWidth
            helperText="The server which serves the JSON encoded task definitions."
            InputLabelProps={{
              shrink: true
            }}
          />
        </ListItem>
      </List>
    </React.Fragment>
  )
}

export default DockerPrefs
