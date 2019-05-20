/** @format */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */

const appRoot = require('app-root-path')

let SentryCli
let download
try {
  SentryCli = require('@sentry/cli')
  download = require('electron-download')
} catch (e) {
  console.error('ERROR: Missing required packages, please run:')
  console.error('npm install --save-dev @sentry/cli electron-download')
  process.exit(1)
}

const VERSION = /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/i
const SYMBOL_CACHE_FOLDER = appRoot.resolve('.electron-symbols')
const PACKAGE = require(appRoot.resolve('./package.json'))
const sentryCli = new SentryCli()

function getElectronVersion() {
  if (!PACKAGE) {
    return false
  }

  const electronVersion =
    (PACKAGE.dependencies && PACKAGE.dependencies.electron) ||
    (PACKAGE.devDependencies && PACKAGE.devDependencies.electron)

  if (!electronVersion) {
    return false
  }

  const matches = VERSION.exec(electronVersion)
  return matches ? matches[0] : false
}

async function downloadSymbols(options) {
  return new Promise((resolve, reject) => {
    download(
      {
        ...options,
        cache: SYMBOL_CACHE_FOLDER
      },
      (err, zipPath) => {
        if (err) {
          reject(err)
        } else {
          resolve(zipPath)
        }
      }
    )
  })
}

async function main() {
  const version = getElectronVersion()
  if (!version) {
    console.error('Cannot detect Electron version, check package.json')
    return
  }

  console.log('We are starting to download all possible Electron symbols.')
  console.log('We need it in order to symbolicate native crashes.')
  console.log('This step is only needed once whenever you update your Electron version.')
  console.log('Just call this script again it should do everything for you.\n')

  let zipPath = await downloadSymbols({
    version,
    platform: 'darwin',
    arch: 'x64',
    dsym: true
  })
  await sentryCli.execute(['upload-dif', '-t', 'dsym', zipPath], true)

  zipPath = await downloadSymbols({
    version,
    platform: 'win32',
    arch: 'ia32',
    symbols: true
  })
  await sentryCli.execute(['upload-dif', '-t', 'breakpad', zipPath], true)

  zipPath = await downloadSymbols({
    version,
    platform: 'win32',
    arch: 'x64',
    symbols: true
  })
  await sentryCli.execute(['upload-dif', '-t', 'breakpad', zipPath], true)

  zipPath = await downloadSymbols({
    version,
    platform: 'linux',
    arch: 'x64',
    symbols: true
  })
  await sentryCli.execute(['upload-dif', '-t', 'breakpad', zipPath], true)

  console.log('Finished downloading and uploading to Sentry.')
  console.log(`Feel free to delete the ${SYMBOL_CACHE_FOLDER}.`)
}

main().catch(error => console.error(error))
