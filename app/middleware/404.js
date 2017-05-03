'use strict'

const HttpError = require('lib/wiring/errors/http-error')

const notFound = (request, response, next) => {
  next(new HttpError(404))
}

module.exports = notFound
