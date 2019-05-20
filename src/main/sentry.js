/** @format */
const Sentry = require('@sentry/electron')

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://165a946fbc3445aea4091b5e704e6a09@sentry.io/1459621',
    environment: process.env.NODE_ENV,
    // eslint-disable-next-line no-unused-vars
    onFatalError: error => {
      process.exit(1)
    }
  })
  console.log(`Sentry initialized for process: ${process.type}`)
}

module.exports = { Sentry }
