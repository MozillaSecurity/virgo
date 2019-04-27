/** @format */

// https://github.com/parcel-bundler/parcel/issues/1005#issuecomment-419688410

const Bundler = require('parcel-bundler')
const Server = require('express')()
const appRoot = require('app-root-path')

const options = {
  outDir: appRoot.resolve('dist/renderer/development'), // The out directory to put the build files in, defaults to dist
  outFile: 'index.html', // The name of the outputFile
  //  publicUrl: './', // The url to server on, defaults to dist
  watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Enabled or disables caching, defaults to true
  cacheDir: appRoot.resolve('.cache'), // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: 'electron', // browser/node/electron, defaults to browser
  https: false, // Serve files over https or http, defaults to false
  logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
  hmrHostname: '', // A hostname for hot module reload, default to ''
  detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
}

const runBundle = async (entrypoint, port) => {
  // Initializes a bundler using the entrypoint location and options provided.
  const bundler = new Bundler(entrypoint, options)

  // Let express use the bundler middleware, this will let Parcel handle every request over your express server.
  Server.use(bundler.middleware())
  Server.listen(port)

  // Run the bundler, this returns the main bundle.
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild.
  await bundler.bundle()
}

runBundle(appRoot.resolve('src/renderer/index.html'), 3000)
