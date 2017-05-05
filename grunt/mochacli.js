'use strict'

const testPort = +('ga'.split('')
  .reduce((p, c) => p + c.charCodeAt().toString(16), ''))

module.exports = {
  options: {
    files: ['<%= paths.src.spec %>'],
    env: {
      NODE_ENV: 'test',
      NODE_PATH: process.env.PWD,
      PORT: testPort
    }
  },
  test: {},
  watch: {
    options: {
      flags: ['--watch']
    }
  }
}
