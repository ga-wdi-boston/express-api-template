'use strict'

const fs = require('fs')
const path = require('path')

const loader = (filename) => {
  const modules = {}
  const parsed = path.parse(filename)
  fs.readdirSync(parsed.dir).filter(entry =>
    !fs.statSync(path.join(parsed.dir, entry)).isDirectory() &&
    parsed.base !== entry
  ).forEach(entry => {
    modules[path.parse(entry).name] = require(path.join(parsed.dir, entry))
  })
  return modules
}

module.exports = loader
