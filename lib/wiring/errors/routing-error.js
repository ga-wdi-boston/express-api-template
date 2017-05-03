'use strict'

// ActionController::RoutingError (uninitialized constant WhateversController):

const RoutingError = function (message) {
  this.name = 'RoutingError'
  this.message = message || 'RoutingError'
}

RoutingError.prototype = Object.create(Error.prototype)
RoutingError.prototype.constructor = RoutingError

module.exports = RoutingError
