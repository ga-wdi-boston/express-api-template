'use strict'

const mongooseBaseName = 'express-api-template'

const environment = process.env.NODE_ENV || 'development'
const database = {
  development: {
    mongoose: {
      name: `${mongooseBaseName}-development`,
      uri: `mongodb://localhost/${mongooseBaseName}-development`
    }
  },
  test: {
    mongoose: {
      name: `${mongooseBaseName}-test`,
      uri: `mongodb://localhost/${mongooseBaseName}-test`
    }
  }
}

module.exports = database[environment]
