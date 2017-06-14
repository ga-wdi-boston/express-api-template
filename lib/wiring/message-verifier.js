'use strict'

const odp = Object.defineProperty
const crypto = require('crypto')

const MessageVerifier = function (key, password) {
  odp(this, 'key', { value: key })
  odp(this, 'password', { value: password })
}

MessageVerifier.prototype.constructor = MessageVerifier

odp(MessageVerifier.prototype, 'cipherAlgorithm', { value: 'aes-256-cbc' })
odp(MessageVerifier.prototype, 'hmacAlgorithm', { value: 'sha256' })
odp(MessageVerifier.prototype, 'plainTextEncoding', { value: 'utf8' })
odp(MessageVerifier.prototype, 'cipherTextEncoding', { value: 'base64' })

const generateDigest = (mv, data) => {
  const hmac = crypto.createHmac(mv.hmacAlgorithm, mv.key)
  hmac.update(data)
  return hmac.digest(mv.cipherTextEncoding)
}

const encrypt = (mv, plain) => {
  const cipher = crypto.createCipher(mv.cipherAlgorithm, mv.password)
  let encrypted = cipher.update(plain, mv.plainTextEncoding, mv.cipherTextEncoding)
  encrypted += cipher.final(mv.cipherTextEncoding)
  return encrypted
}

const decrypt = (mv, cipherText) => {
  const decipher = crypto.createDecipher(mv.cipherAlgorithm, mv.password)
  let decrypted = decipher.update(cipherText, mv.cipherTextEncoding, mv.plainTextEncoding)
  decrypted += decipher.final(mv.plainTextEncoding)
  return decrypted
}

MessageVerifier.prototype.generate = function (value) {
  const data = encrypt(this, value)
  return `${data}--${generateDigest(this, data)}`
}

MessageVerifier.prototype.verify = function (signedMessage) {
  const split = signedMessage.split('--')
  const cipherText = split[0]
  const digest = split[1]

  return generateDigest(this, cipherText) === digest &&
    decrypt(this, cipherText)
}

module.exports = MessageVerifier
