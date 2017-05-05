'use strict'
require('dotenv').load({
  silent: process.env.NODE_ENV === 'production' // don't log missing .env
})

const express = require('express')
const app = express()
const middleware = require('app/middleware')

app.set('root', __dirname)

middleware.before(app)

const routes = require('config/routes')

app.use(routes.router)

middleware.after(app)

// catch 404 and forward to error handler
app.use(middleware['404'])

// error handlers
app.use(middleware['error-handler'])

const debug = require('debug')('express-api-template:server')
const http = require('http')

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  const port = parseInt(val, 10)
  debug('Normalied port is', port)
  return port >= 0 ? port : isNaN(port) ? val : false
}

/**
 * Get port from environment and store in Express.
 */

const devPort = +('GA'.split('').reduce((p, c) =>
 p + c.charCodeAt().toString(16), '')
)

const port = normalizePort(process.env.PORT || devPort)
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Server listening on ' + bind)
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.on('error', onError)
server.on('listening', onListening)
server.listen(port)

module.exports = {
  server
}
