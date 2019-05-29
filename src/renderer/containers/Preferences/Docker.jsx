/** @format */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ipcRenderer, remote } from 'electron'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'

import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'
import RefreshIcon from '@material-ui/icons/Refresh'
import { withStyles, Typography } from '@material-ui/core'

import * as actionCreators from '../../store/actions'
import { URLValidator, EmailValidator } from '../../lib/validators'

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  updateButton: {
    padding: '3px'
  }
})

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
    },
    updateMessage: ''
  }

  componentDidMount() {
    ipcRenderer.on('updateMessage', this.onUpdateMessage)
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('updateMessage', this.onUpdateMessage)
  }

  onCheckUpdate = () => {
    ipcRenderer.send('updateCheck', {})
  }

  onUpdateMessage = (event, data) => {
    this.setState({ updateMessage: data.msg })
  }

  onChange = ({ target: { id, value } }) => {
    const source = this.state[id]
    const invalid = source.isInvalid(value)

    this.setState({
      ...this.state,
      [id]: {
        ...source,
        value,
        error: Boolean(invalid),
        helperText: invalid || source.helperText
      }
    })
  }

  onBlur = ({ target: { id } }) => {
    console.log('Validating ...')

    const source = this.state[id]

    switch (id) {
      case 'taskURL':
        if (!source.error) {
          this.props.updateTaskURL(source.value || source.placeholder)
          console.log('Saved.')
        }
        break
      case 'contactEmail':
        if (!source.error) {
          this.props.updateContactEmail(source.value || source.placeholder)
          console.log('Saved.')
        }
        break
      default:
        console.log('Unrecognized target id for validating.')
    }
  }

  render() {
    const { updateMessage, taskURL, contactEmail } = this.state
    const { classes, toggleEarlyReleases, earlyReleases } = this.props

    return (
      <List>
        <ListItem>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography color="textPrimary" variant="body2">
                Current Version: {remote.app.getVersion()}
              </Typography>
            </Grid>
            <Grid container spacing={8} direction="row" alignItems="center">
              <Grid item>
                <Tooltip title="Check Updates">
                  <IconButton
                    aria-label="Check Updates"
                    small="small"
                    className={classes.updateButton}
                    onClick={this.onCheckUpdate}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={10}>
                <Typography color="textPrimary" variant="body2">
                  {updateMessage}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={0} direction="column">
              <Typography color="textPrimary" variant="body2">
                Enable Early Releases
                <Checkbox onChange={toggleEarlyReleases} checked={earlyReleases} color="primary" />
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <MyTextField {...taskURL} onChange={this.onChange} onBlur={this.onBlur} />
        </ListItem>
        <ListItem>
          <MyTextField {...contactEmail} onChange={this.onChange} onBlur={this.onBlur} />
        </ListItem>
      </List>
    )
  }
}

DockerPrefs.propTypes = {
  classes: PropTypes.object.isRequired,
  updateTaskURL: PropTypes.func.isRequired,
  taskURL: PropTypes.string.isRequired,
  updateContactEmail: PropTypes.func.isRequired,
  contactEmail: PropTypes.string.isRequired,
  earlyReleases: PropTypes.bool.isRequired,
  toggleEarlyReleases: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    taskURL: state.preferences.taskURL,
    contactEmail: state.preferences.contactEmail,
    earlyReleases: state.preferences.earlyReleases
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateTaskURL: actionCreators.updateTaskURL,
      updateContactEmail: actionCreators.updateContactEmail,
      toggleEarlyReleases: actionCreators.toggleEarlyReleases
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DockerPrefs))
