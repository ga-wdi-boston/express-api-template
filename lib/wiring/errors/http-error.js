'use strict'

const code2String = (code) => {
  switch (code) {
    case 400:
      return 'Bad Request'
    case 401:
      return 'Unauthorized'
    case 402:
      return 'Payment Required'
    case 403:
      return 'Forbidden'
    case 404:
      return 'Not Found'
    case 405:
      return 'Method Not Allowed'
    case 406:
      return 'Not Acceptable'
    case 407:
      return 'Proxy Authentication Required'
    case 408:
      return 'Request Timeout'
    case 409:
      return 'Conflict'
    case 410:
      return 'Gone'
    case 411:
      return 'Length Required'
    case 412:
      return 'Precondition Failed'
    case 413:
      return 'Request Entity Too Large'
    case 414:
      return 'Request-URI Too Long'
    case 415:
      return 'Unsupported Media Type'
    case 416:
      return 'Requested Range Not Satisfiable'
    case 417:
      return 'Expectation Failed'
    default:
      return 'Unknown Status'
  }
}

const HttpError = function HttpError (code) {
  this.name = 'HttpError'
  this.status = code
  this.message = `${code} ${code2String(code)}`
}

HttpError.prototype = new Error()

module.exports = HttpError
