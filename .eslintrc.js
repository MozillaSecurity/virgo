/** @format */

const pkg = require('./package.json')

const version = dependency => {
  if (pkg.dependencies && pkg.dependencies[dependency]) {
    return pkg.dependencies[dependency].replace(/[^0-9.]/g, '')
  }
  if (pkg.devDependencies && pkg.devDependencies[dependency]) {
    return pkg.devDependencies[dependency].replace(/[^0-9.]/g, '')
  }
}

module.exports = {
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    jest: true,
    node: true
  },
  parser: 'babel-eslint',
  extends: [
    'react-app',
    'plugin:flowtype/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/react'
  ],
  plugins: ['flowtype', 'react', 'prettier'],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false
    },
    react: {
      version: version('react'),
      flowVersion: version('flow-bin')
    }
  }
}
