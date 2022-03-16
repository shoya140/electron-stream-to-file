/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./webpack.common.js')

module.exports = [
  {
    ...baseConfig,
    target: 'electron-main',
    entry: {
      main: './src/main.js',
    },
  },
  {
    ...baseConfig,
    target: 'electron-preload',
    entry: {
      preload: './src/preload.js',
    },
  },
]
