/** @format */

/*
 * Changes to the configuration require a restart in VSCode to be effective.
 */

const pkg = require('../../package.json')

const version = dependency => {
  if (pkg.dependencies && pkg.dependencies[dependency]) {
    return pkg.dependencies[dependency].replace(/[^0-9.]/g, '')
  }
  if (pkg.devDependencies && pkg.devDependencies[dependency]) {
    return pkg.devDependencies[dependency].replace(/[^0-9.]/g, '')
  }
  console.log(`Unable to find dependency in package.json for "${dependency}".`)
  return undefined
}

/* New base configuration. */
module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    jest: true,
    node: true,
    browser: true
  },
  parser: 'babel-eslint',
  extends: [
    // Base configuration.
    'airbnb',
    'plugin:jest/recommended',
    'plugin:flowtype/recommended',
    'plugin:prettier/recommended',
    // 'prettier/flowtype', // Causes issues with prettier.printWidth
    'prettier/react'
  ],
  plugins: ['react', 'jest', 'flowtype', 'prettier'],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false
    },
    react: {
      version: 'detect',
      flowVersion: version('flow-bin')
    },
    'import/core-modules': ['electron', 'electron-builder', 'electron-devtools-installer']
  },
  rules: {
    // Add rules for above plugins.
    'no-console': 0
  }
}
