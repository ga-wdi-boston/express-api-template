'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Upload = models.upload

const s3Upload = require('../../lib/s3-upload')
const multer = require('multer')
const multerUpload = multer({ dest: '/tmp' })

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({
      uploads: uploads.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

// const show = (req, res) => {
//   res.json({
//     upload: req.upload.toJSON({ virtuals: true, user: req.user })
//   })
// }

const create = (req, res, next) => {
  console.log('req.body is ', req.body)
  console.log('req.file is ', req.file)

  const options = {
    path: req.file.path,
    title: req.body.image.title,
    mimeType: req.file.mimetype,
    originalName: req.file.originalname
  }

  s3Upload(options)
    .then((s3Response) => {
      return Upload.create({
        url: s3Response.Location,
        title: options.title
      })
    })
    .then(upload =>
      res.status(201)
        .json({
          upload: upload.toJSON()
        }))
    .catch(console.error)
}

// const update = (req, res, next) => {
//   delete req.body._owner  // disallow owner reassignment.
//   req.upload.update(req.body.upload)
//     .then(() => res.sendStatus(204))
//     .catch(next)
// }

// const destroy = (req, res, next) => {
//   req.upload.remove()
//     .then(() => res.sendStatus(204))
//     .catch(next)
// }

module.exports = controller({
  index,
  // show,
  create
  // update,
  // destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show', 'create'] },
  { method: setModel(Upload), only: ['show'] },
  { method: setModel(Upload, { forUser: true }), only: ['update', 'destroy'] },
  { method: multerUpload.single('image[file]'), only: ['create'] }
] })
