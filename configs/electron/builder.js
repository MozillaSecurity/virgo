/** @format */

const builder = require('electron-builder')
const appRoot = require('app-root-path')

const appInfo = require(appRoot.resolve('./package.json'))

const { Platform, Arch } = builder
const config = {
  /* eslint-disable no-template-curly-in-string */
  productName: process.platform === 'linux' ? appInfo.name.toLowerCase() : appInfo.name,
  appId: `org.mozilla.${appInfo.name.toLowerCase()}`,
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
    category: 'public.app-category.security'
  },
  linux: {
    category: 'Security'
  }
}

const main = async () => {
  let targetArgs
  if (process.env.NODE_ENV === 'production') {
    targetArgs = {
      windows64: Platform.WINDOWS.createTarget(['nsis'], Arch.x64),
      linux64: Platform.LINUX.createTarget(['AppImage'], Arch.x64),
      macos64: Platform.MAC.createTarget(['dmg'], Arch.x64)
    }
  } else {
    targetArgs = {
      windows64: Platform.WINDOWS.createTarget(['dir'], Arch.x64),
      linux64: Platform.LINUX.createTarget(['dir'], Arch.x64),
      macos64: Platform.MAC.createTarget(['dir'], Arch.x64)
    }
  }

  let targets = process.argv.filter(arg => !!targetArgs[arg]).map(arg => targetArgs[arg])
  if (targets.length === 0) {
    targets = Object.keys(targetArgs).map(arg => targetArgs[arg])
  }

  console.log(`Building on platform ${process.platform} in ${process.env.NODE_ENV} mode.`)
  // eslint-disable-next-line no-restricted-syntax
  for (const target of targets) {
    // eslint-disable-next-line no-await-in-loop
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

main()
