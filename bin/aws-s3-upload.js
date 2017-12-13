'use strict'

const s3Upload = require('../lib/s3-upload')

const options = {
  path: process.argv[2],
  name: process.argv[3]
}

s3Upload(options)
  .then(console.log)
  .catch(console.error)
