// run using:
// NODE_PATH=. node bin/aws-s3-upload.js public/huckleberry.gif wutdis

'use strict'

const s3Upload = require('../lib/s3-upload')
const Upload = require('../app/models/upload')
const mongoose = require('../app/middleware/mongoose')

const options = {
  path: process.argv[2],
  name: process.argv[3]
}

s3Upload(options)
  .then((s3Response) => {
    return Upload.create({
      url: 'someshit',
      title: 'somet title'
    })
  })
  .then(console.log)
  .catch(console.error)
  .then(() => mongoose.connection.close())
