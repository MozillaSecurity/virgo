/** @format */

import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Typography, withStyles } from '@material-ui/core'

const errorTitles = [
  'Abort mission, back to base.',
  'We have a problem ...',
  'Stay calm and do not panic!'
]

const styles = theme => ({})

export const randomErrorTitle = () => {
  return errorTitles[Math.floor(Math.random() * errorTitles.length)]
}

class ErrorDialog extends React.Component {
  static defaultProps = {
    title: randomErrorTitle()
  }

  state = {
    open: true
  }

  onSuccess = () => {
    const { onSuccessCallback } = this.props

    onSuccessCallback()
    this.setState({ open: false })
  }

  onClose = () => {
    this.setState({ open: false })
  }

  onAbort = () => {
    this.setState({ open: false })
  }

  render() {
    const { open } = this.state
    const { title, content } = this.props

    return (
      <div>
        <Dialog
          open={open}
          onClose={this.onClose}
          disableBackdropClick
          disableEscapeKeyDown
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <Typography>{content}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onAbort} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSuccess} color="primary" autoFocus>
              Feedback
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

ErrorDialog.propTypes = {
  onSuccessCallback: PropTypes.func.isRequired,
  content: PropTypes.node.isRequired,
  title: PropTypes.string
}

export default withStyles(styles, { withTheme: true })(ErrorDialog)
