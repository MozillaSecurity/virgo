/** @format */

const builder = require('electron-builder')
const appRoot = require('app-root-path')

// eslint-disable-next-line import/no-dynamic-require
const appInfo = require(appRoot.resolve('./package.json'))

const { Platform, Arch } = builder
const userConfig = {
  /* eslint-disable no-template-curly-in-string */
  productName: appInfo.name.charAt(0).toUpperCase() + appInfo.name.slice(1),
  appId: `org.mozilla.${appInfo.name}`,
  copyright: 'Copyright © 2019 ${author}',
  artifactName: '${name}-${version}-${os}-${arch}.${ext}',
  files: ['build/app/**/*', 'resources/build/'],
  directories: {
    output: 'build/releases/${os}/${arch}',
    buildResources: 'resources/build'
  },
  compression: 'normal',
  publish: [
    {
      provider: 'github'
    }
  ],
  snap: {
    confinement: 'classic',
    grade: 'devel'
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: 'always',
    deleteAppDataOnUninstall: true
  },
  win: {},
  mac: {
    category: 'public.app-category.security'
  },
  linux: {
    synopsis: appInfo.description,
    executableName: appInfo.name,
    category: 'Security',
  }
}

/* To test the update process in packaged production builds, locally via Minio. */
if (process.env.APP_TEST_PUBLISHER === 'S3') {
  userConfig.publish = [
    {
      provider: 's3',
      bucket: 'electron-builder',
      endpoint: 'http://127.0.0.1:9000'
    }
  ]
}

const main = async () => {
  let targetArgs
  if (process.env.NODE_ENV === 'production') {
    targetArgs = {
      windows64: Platform.WINDOWS.createTarget(['nsis'], Arch.x64),
      linux64: Platform.LINUX.createTarget([/*'snap' */ 'AppImage'], Arch.x64),
      macos64: Platform.MAC.createTarget(['dmg' /* 'pkg' */], Arch.x64)
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
    const config = JSON.parse(JSON.stringify(userConfig))
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
