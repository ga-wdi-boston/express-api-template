'use strict'

require('dotenv').config()

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const mime = require('mime-types')

const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const promiseRandomBytes = function () {
  return new Promise(function (resolve, reject) {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        reject(err)
      }
      resolve(buf.toString('hex'))
    })
  })
}

const promiseS3Upload = function (file) {
  const today = new Date().toISOString().split('T')[0]

  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET_NAME,
    ContentType: file.mimeType,
    Key: `${today}/${file.name}${file.ext}`,
    Body: file.stream
  }

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const s3Upload = function (file) {
  file.stream = fs.createReadStream(file.path)
  file.ext = path.extname(file.path)
  file.mimeType = mime.lookup(file.path)
  console.log('mime type is ', file.mimeType)

  return promiseRandomBytes()
    .then((randomString) => {
      file.name = randomString
      return file
    })
    .then(promiseS3Upload)
}

module.exports = s3Upload
