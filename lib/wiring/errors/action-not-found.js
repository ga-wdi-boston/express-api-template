'use strict'

// AbstractController::ActionNotFound \
// (The action 'action' could not be found for ExamplesController)

const ActionNotFound = function (message) {
  this.name = 'ActionNotFound'
  this.message = message || 'ActionNotFound'
}

ActionNotFound.prototype = Object.create(Error.prototype)
ActionNotFound.prototype.constructor = ActionNotFound

module.exports = ActionNotFound
