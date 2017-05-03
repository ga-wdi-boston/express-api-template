'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Example = models.example

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Example.find()
    .then(examples => res.json({
      examples: examples.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    example: req.example.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const example = Object.assign(req.body.example, {
    _owner: req.user._id
  })
  Example.create(example)
    .then(example =>
      res.status(201)
        .json({
          example: example.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body._owner  // disallow owner reassignment.
  req.example.update(req.body.example)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.example.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Example), only: ['show'] },
  { method: setModel(Example, { forUser: true }), only: ['update', 'destroy'] }
] })
