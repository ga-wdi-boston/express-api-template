'use strict'

const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

uploadSchema.virtual('length').get(function length () {
  return this.text.length
})

const Upload = mongoose.model('Upload', uploadSchema)

module.exports = Upload
