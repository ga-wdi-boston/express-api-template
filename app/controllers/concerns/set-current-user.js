'use strict'

const models = require('app/models')
const User = models.user

const MessageVerifier = require('lib/wiring/message-verifier')

const decodeToken = (signedSecureToken) => {
  const mv = new MessageVerifier('secure-token', process.env.SECRET_KEY)
  return mv.verify(signedSecureToken)
}

const setUser = function (req, res, next) {
  const tokenRegex = /^Token token=/
  const separatorRegex = /\s*(?::|;|\t+)\s*/
  const auth = req.headers.authorization
  if (auth && tokenRegex.test(auth)) {
    const opts = auth.replace(tokenRegex, '').split(separatorRegex)
    const signedToken = opts.shift()
    const token = decodeToken(signedToken)
    User.findOne({ token })
      .then(user => {
        req.user = user
        next()
      })
      .catch(err => next(err))
  } else {
    next()
  }
}

module.exports = setUser
