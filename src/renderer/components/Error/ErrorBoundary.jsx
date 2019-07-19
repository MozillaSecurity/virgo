/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import * as Sentry from '@sentry/electron'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import Logger from '../../../shared/logger'
import { Environment } from '../../../shared/common'
import ErrorDialog from './ErrorDialog'
import CrashPage from '../CrashPage'

const logger = new Logger('ErrorBoundary')

const styles = theme => ({
  summary: {
    outline: 'none !important'
  }
})

class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null, eventId: null }

  sendReport = () => {
    const { error, errorInfo, eventId } = this.state
    if (!Environment.isTest) {
      /* Send the crash report to Sentry. */
      Sentry.withScope(scope => {
        scope.setExtra(errorInfo)
        this.setState({ eventId: Sentry.captureException(error) })
      })
      /* Collect user feedback as follow up. */
      Sentry.showReportDialog({ eventId })
    } else {
      logger.error(`Error: ${error}`)
      logger.error(`ErrorInfo: ${JSON.stringify(errorInfo)}`)
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
    const { history } = this.props

    this.setState({ error, errorInfo })

    history.listen((location, action) => {
      if (this.state.error) {
        this.setState({ error: null })
      }
    })
  }

  render() {
    const { children } = this.props
    const { error, errorInfo } = this.state

    if (error) {
      return (
        <div>
          <CrashPage />
          <ErrorDialog
            show
            content={this.errorContent(error, errorInfo)}
            onSuccessCallback={() => this.sendReport()}
          />
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

export default withRouter(withStyles(styles, { withTheme: true })(ErrorBoundary))
