/** @format */

const { defaults } = require('jest-config')

module.exports = {
  verbose: true,
  rootDir: '../../',
  coverageDirectory: '<rootDir>/../../dist/coverage',
  collectCoverageFrom: ['src/**/*.js?(x)'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '\\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      '<rootDir>/configs/jest/fileTransform.js'
  },
  globals: {
    'babel-jest': {
      useBabelrc: true
    }
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  projects: [
    {
      rootDir: '.',
      displayName: 'Main',
      runner: '@jest-runner/electron/main',
      testEnvironment: 'node',
      testMatch: ['**/main/__tests__/**/*.(spec|test).js']
    },
    {
      rootDir: '.',
      displayName: 'Renderer',
      runner: '@jest-runner/electron',
      testEnvironment: '@jest-runner/electron/environment',
      testMatch: ['**/renderer/__tests__/**/*.(spec|test).jsx']
    }
  ]
}
