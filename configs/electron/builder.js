/** @format */

const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const builder = require('electron-builder')

const { Platform, Arch } = builder
const appRoot = require('app-root-path')

const build = async (targets, config) => {
  console.log(`Building on platform ${process.platform} in ${process.env.NODE_ENV} mode.`)
  for (const target of targets) {
    await builder
      .build({ targets: target, config })
      .then(files => {
        console.log('🙌   Build is OK!')
        files.map(file => console.log(`• ${file}`))
      })
      .catch(error => {
        console.log(`🔥   Build is toast!\n${error}`)
      })
  }
}

const main = async () => {
  const commitNumber = (await exec('git rev-list HEAD --count')).stdout.trim()
  const commitHash = (await exec("git log --pretty=format:'%h' -n 1")).stdout.trim()
  const buildVersion = `${commitNumber} - ${commitHash}`
  const bundleShortVersion = require(appRoot.resolve('./package.json')).version

  process.env.ELECTRON_BUILDER_CACHE = appRoot.resolve('.cache/electron-builder/')

  let targetArgs
  if (process.env.NODE_ENV === 'production') {
    targetArgs = {
      win64: Platform.WINDOWS.createTarget(['zip'], Arch.x64),
      linux64: Platform.LINUX.createTarget(['AppImage'], Arch.x64),
      macos: Platform.MAC.createTarget(['dmg'], Arch.x64)
    }
  } else {
    targetArgs = {
      win64: Platform.WINDOWS.createTarget(['dir'], Arch.x64),
      linux64: Platform.LINUX.createTarget(['dir'], Arch.x64),
      macos: Platform.MAC.createTarget(['dir'], Arch.x64)
    }
  }

  let targets = process.argv.filter(arg => !!targetArgs[arg]).map(arg => targetArgs[arg])
  if (targets.length === 0) {
    targets = Object.keys(targetArgs).map(arg => targetArgs[arg])
  }

  const config = {
    productName: process.platform === 'linux' ? 'virgo' : 'Virgo',
    appId: 'org.mozilla.${name}',
    copyright: 'Copyright © 2019 ${author}',
    artifactName: '${name}-${version}-${os}-${arch}.${ext}',
    files: ['dist/main/main.js', { from: 'dist/renderer/production' }, { from: 'resources/build' }, '!**/*.map'],
    directories: {
      output: 'dist/releases/${os}/${arch}',
      buildResources: 'resources/build'
    },
    compression: 'normal',
    nsis: {
      oneClick: false,
      perMachine: true,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: 'always'
    },
    win: {},
    mac: {
      bundleVersion: buildVersion,
      bundleShortVersion,
      category: 'public.app-category.security'
    },
    linux: {
      category: 'Security'
    }
  }

  build(targets, config)
}

main()
