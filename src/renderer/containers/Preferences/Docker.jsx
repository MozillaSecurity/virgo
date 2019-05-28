/** @format */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core'

import * as actionCreators from '../../store/actions'
import { URLValidator, EmailValidator } from '../../lib/validators'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({})

const MyTextField = ({ ...props }) => {
  return (
    <TextField
      {...props}
      fullWidth
      InputLabelProps={{
        shrink: true
      }}
    />
  )
}

class DockerPrefs extends React.Component {
  state = {
    taskURL: {
      id: 'taskURL',
      value: '',
      label: 'Task Definition Server',
      placeholder: this.props.taskURL,
      error: false,
      helperText: 'The server which serves the JSON encoded task definitions.',
      isInvalid: value =>
        value === '' || URLValidator.test(value) ? false : 'This appears not to be a valid URL.'
    },
    contactEmail: {
      id: 'contactEmail',
      value: '',
      label: 'Contact Email',
      placeholder: this.props.contactEmail,
      error: false,
      helperText: 'The contact address over which we shall notify you.',
      isInvalid: value =>
        value === '' || EmailValidator.test(value)
          ? false
          : 'This appears not to a valid Email address.'
    }
  }

  onChange = ({ target: { id, value } }) => {
    const invalid = this.state[id].isInvalid(value)

    this.setState({
      ...this.state,
      [id]: {
        ...this.state[id],
        value,
        error: Boolean(invalid),
        helperText: invalid || this.state[id].helperText
      }
    })
  }

  apply = event => {
    event.preventDefault()

    /* Check if there are any errors in our state. */
    const errors = Object.keys(this.state)
      .map(group => this.state[group])
      .filter(item => item.error === true)

    if (errors.length !== 0) {
      return
    }

    this.props.updateTaskURL(this.state.taskURL.value || this.state.taskURL.placeholder)
    this.props.updateContactEmail(this.state.contactEmail.value || this.state.taskURL.placeholder)

    console.log(`Applied${JSON.stringify(this.state)}`)
  }

  render() {
    const { taskURL, contactEmail } = this.state

    return (
      <form noValidate>
        <List>
          <ListItem>
            <MyTextField {...taskURL} onChange={this.onChange} />
          </ListItem>
          <ListItem>
            <MyTextField {...contactEmail} onChange={this.onChange} />
          </ListItem>
          <ListItem />
        </List>
        <Button type="button" onClick={this.apply} label="Save" color="primary" variant="contained">
          Apply
        </Button>
      </form>
    )
  }
}

DockerPrefs.propTypes = {
  updateTaskURL: PropTypes.func.isRequired,
  taskURL: PropTypes.string.isRequired,
  updateContactEmail: PropTypes.func.isRequired,
  contactEmail: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    taskURL: state.preferences.taskURL,
    contactEmail: state.preferences.contactEmail
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateTaskURL: actionCreators.updateTaskURL,
      updateContactEmail: actionCreators.updateContactEmail
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DockerPrefs))
