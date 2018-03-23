'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Upload = models.upload

const s3Upload = require('lib/aws-upload')
const multer = require('multer')
const multerUpload = multer({ dest: '/tmp/' })

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({
      uploads: uploads.map((e) =>
        e.toJSON())
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    upload: req.upload.toJSON({ virtuals: true, user: req.user })
  })
}

// pass a file object with path, originalname, and mimetype
const create = (req, res, next) => {
  console.log('req.body is ', req.body)
  console.log('req.file is ', req.file)

  const file = {
    path: req.file.path,
    originalname: req.file.originalname,
    name: req.body.image.title,
    mimetype: req.file.mimetype
  }

  // file.mimetype = mime.lookup(file.path)

  s3Upload(file)
    .then((s3Response) => Upload.create({
      url: s3Response.Location,
      title: file.name
    }))
    .then(upload =>
      res.status(201)
        .json({
          upload: upload.toJSON()
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body._owner  // disallow owner reassignment.
  req.upload.update(req.body.upload)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.upload.remove()
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
  { method: authenticate, except: ['index', 'show', 'create'] },
  { method: multerUpload.single('image[file]'), only: ['create'] },
  { method: setModel(Upload), only: ['show'] },
  { method: setModel(Upload, { forUser: true }), only: ['update', 'destroy'] }
] })
