/** @format */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const appRoot = require('app-root-path')

let SentryCli
try {
  SentryCli = require('@sentry/cli')
} catch (e) {
  console.error('ERROR: Missing required packages, please run:')
  console.error('npm install --save-dev @sentry/cli')
  process.exit(1)
}

const PACKAGE = require(appRoot.resolve('./package.json'))
const sentryCli = new SentryCli()

async function main() {
  await sentryCli.execute(
    [
      'releases',
      'files',
      `${PACKAGE.name}-${PACKAGE.version}`,
      'upload-sourcemaps',
      'dist',
      '--url-prefix',
      '~/dist/',
      '--rewrite',
      '--validate'
    ],
    true
  )
}

main().catch(error => console.error(error))
