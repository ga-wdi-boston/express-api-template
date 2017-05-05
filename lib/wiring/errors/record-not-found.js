'use strict'

// ActiveRecord::RecordNotFound

const RecordNotFound = function (message) {
  this.name = 'RecordNotFound'
  this.message = message || 'RecordNotFound'
  this.stack = (new Error()).stack
}

RecordNotFound.prototype = Object.create(Error.prototype)
RecordNotFound.prototype.constructor = RecordNotFound

module.exports = RecordNotFound
