/** @format */

const { defaults } = require('jest-config')

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'jsx'],
  verbose: true,
  collectCoverageFrom: ['src/**'],
  coverageDirectory: 'dist/coverage',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/conf/jest/fileTransform.js',
    '\\.(css|less)$': '<rootDir>/conf/jest/fileTransform.js'
  },
  // To determine which kind of files are test-files.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|jsx)?$',
  globals: {
    'babel-jest': {
      useBabelrc: true
    }
  },
  // To run tests inside of Electron.
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment'
}
