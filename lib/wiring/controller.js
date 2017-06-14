'use strict'

const normalizeOption = (options, name) =>
  options && options[name] &&
  (!Array.isArray(options[name]) ? [options[name]] : options[name])

const controller = (actions, options) => {
  const befores = options && options.before

  return Object.keys(actions).reduce((m, k) => {
    m[k] = []
    if (befores) {
      befores.forEach(before => {
        const only = normalizeOption(before, 'only')
        const except = normalizeOption(before, 'except')
        if (before.method) {
          if (!only && !except ||
              only && only.indexOf(k) >= 0 ||
              except && except.indexOf(k) < 0) {
            m[k].push(before.method)
          }
        }
      })
    }

    m[k].push(actions[k])
    return m
  }, {})
}

module.exports = controller
