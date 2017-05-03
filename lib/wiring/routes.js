'use strict'

const express = require('express')
const router = express.Router()

const RoutingError = require('./errors/routing-error')
const ActionNotFound = require('./errors/action-not-found')

const controllers = require('app/controllers')

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

const noController = (options) => {
  const msg = `unknown controller '${options.controller.capitalize()}'`
  return function (req, res, next) {
    next(new RoutingError(msg))
  }
}

const noAction = (options) => {
  const msg = `The action '${options.action}' ` +
    `could not be found for controller '${options.controller.capitalize()}'`
  return function (req, res, next) {
    next(new ActionNotFound(msg))
  }
}

const middlewares = (options) => {
  const split = options.split('#')
  options = { controller: split[0], action: split[1] }
  const controller = controllers[options.controller]
  const action =
    controller && (controller[options.action] || noAction(options)) ||
    noController(options)

  return action
}

const route = function (method, path, controllerActionName) {
  const args = [path].concat(middlewares(controllerActionName))
  router[method].apply(router, args)
  return this
}

const root = function (controllerAction) {
  return this.route('get', '/', controllerAction)
}

const normalizeOption = (options, name) =>
  options && options[name] &&
  (!Array.isArray(options[name]) ? [options[name]] : options[name])

const resources = function (controller, options) {
  const only = normalizeOption(options, 'only')
  const except = normalizeOption(options, 'except')

  const actions = [
    { path: `/${controller}`, method: 'get', name: 'index' },
    { path: `/${controller}/:id`, method: 'get', name: 'show' },
    { path: `/${controller}`, method: 'post', name: 'create' },
    { path: `/${controller}/:id`, method: 'patch', name: 'update' },
    { path: `/${controller}/:id`, method: 'put', name: 'update' },
    { path: `/${controller}/:id`, method: 'delete', name: 'destroy' }
  ]
  actions.forEach(action => {
    if (only && only.indexOf(action.name) < 0 ||
        except && except.indexOf(action.name) >= 0) {
      return
    }

    route(action.method, action.path, `${controller}#${action.name}`)
  })
  return this
}

const routes = {
  route,
  root,
  resources,
  router
}

'get post patch put delete'.split(' ').forEach(method => {
  routes[method] = function (path, controllerAction) {
    return this.route(method, path, controllerAction)
  }
})

module.exports = routes
