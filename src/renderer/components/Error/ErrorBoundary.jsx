/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import * as Sentry from '@sentry/electron'

import { withStyles } from '@material-ui/core/styles'

import ErrorDialog from './ErrorDialog'

const styles = theme => ({
  summary: {
    outline: 'none !important'
  }
})

class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null, eventId: null }

  sendReport = () => {
    const { error, errorInfo, eventId } = this.state

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      /* Send the crash report to Sentry. */
      Sentry.withScope(scope => {
        scope.setExtra(errorInfo)
        this.setState({ eventId: Sentry.captureException(error) })
      })
      /* Collect user feedback as follow up. */
      Sentry.showReportDialog({ eventId })
    } else {
      console.log(`Error: ${error}`)
      console.log(`ErrorInfo: ${JSON.stringify(errorInfo)}`)
    }
  }

  errorContent = (error, errorInfo) => {
    const { classes } = this.props

    return (
      <details>
        <summary className={classes.summary}>See Details</summary>
        {error && error.toString()}
        <br />
        <pre>{errorInfo.componentStack}</pre>
      </details>
    )
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    const { children } = this.props
    const { error, errorInfo } = this.state

    if (error) {
      return (
        <div>
          <ErrorDialog show content={this.errorContent(error, errorInfo)} onSuccessCallback={() => this.sendReport()} />
        </div>
      )
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(ErrorBoundary)
