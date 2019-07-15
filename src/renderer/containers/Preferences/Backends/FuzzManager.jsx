/** @format */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, Typography } from '@material-ui/core'

import { PortValidator, ProtocolValidator } from '../../../lib/validators'
import * as actionCreators from '../../../store/actions'
import Logger from '../../../../shared/logger'
import FuzzManagerConf from '../../../lib/fuzzmanager'

const logger = new Logger('Prefs.FuzzManager')

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  updateButton: {
    padding: '3px'
  }
})

const MyTextField = ({ ...props }) => {
  delete props.isInvalid

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

class BackendFuzzManagerPrefs extends React.Component {
  constructor() {
    super()

    this.fuzzmanager = new FuzzManagerConf({ configName: 'fuzzmanagerconf' })
    this.fuzzmanager.readFile()

    this.state = {
      host: {
        id: 'host',
        value: '',
        label: 'Backend Server Host',
        placeholder: this.fuzzmanager.get('serverhost'),
        error: false,
        helperText: 'The host to which the crash reports are sent.',
        isInvalid: value => (value !== '' ? false : 'This appears not to be a valid hostname.')
      },
      port: {
        id: 'port',
        value: '',
        type: 'number',
        label: 'Backend Server Port',
        placeholder: this.fuzzmanager.get('serverport').toString(),
        error: false,
        helperText: 'The port number at which to contact the server.',
        isInvalid: value =>
          value === '' || PortValidator.test(value)
            ? false
            : 'This appears not to a valid port number.'
      },
      protocol: {
        id: 'protocol',
        value: '',
        label: 'Backend Server Protocol',
        placeholder: this.fuzzmanager.get('serverproto'),
        error: false,
        helperText: 'The transfer protocol.',
        isInvalid: value =>
          value === '' || ProtocolValidator.test(value)
            ? false
            : 'This appears not to be a supported or valid protocol.'
      }
    }
  }

  componentWillUnmount() {
    this.fuzzmanager.set('clientid', this.props.contactEmail)
    this.fuzzmanager.saveFile()
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
    const source = this.state[id]

    switch (id) {
      case 'host':
        if (!source.error) {
          this.fuzzmanager.set('serverhost', source.value || source.placeholder)
        }
        break
      case 'port':
        if (!source.error) {
          this.fuzzmanager.set('serverport', source.value || source.placeholder)
        }
        break
      case 'protocol':
        if (!source.error) {
          this.fuzzmanager.set('serverproto', source.value || source.placeholder)
        }
        break
      default:
        logger.error('Unrecognized target id for validating.')
    }
  }

  render() {
    const { host, port, protocol } = this.state
    const { classes } = this.props

    return (
      <List>
        <ListItem>
          <MyTextField {...host} onChange={this.onChange} onBlur={this.onBlur} />
        </ListItem>
        <ListItem>
          <MyTextField {...port} onChange={this.onChange} onBlur={this.onBlur} />
        </ListItem>
        <ListItem>
          <MyTextField {...protocol} onChange={this.onChange} onBlur={this.onBlur} />
        </ListItem>
      </List>
    )
  }
}

BackendFuzzManagerPrefs.propTypes = {
  classes: PropTypes.object.isRequired,
  contactEmail: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    contactEmail: state.preferences.contactEmail
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BackendFuzzManagerPrefs))
