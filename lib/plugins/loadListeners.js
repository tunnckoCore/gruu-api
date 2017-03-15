/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var utils = require('../utils')

module.exports = function loadListeners () {
  return function wrapHookHandlers_ (app) {
    app.delegate({
      on: handlerFactory(app, 'on'),
      off: handlerFactory(app, 'off'),
      once: handlerFactory(app, 'once')
    })

    return app
  }
}

/**
 * Utilities / Helpers
 */

function handlerFactory (app, methodName) {
  return function type_ (name, handler) {
    var fn = name === 'error'
      ? errorHandler
      : nonErrorHandler(app, methodName, handler)

    app[methodName](name, fn)
  }
}

function nonErrorHandler (app, methodName, handler) {
  return function handler_ (a, b, c, d) {
    var fn = utils.promisify(handler, app.options)

    fn(a, b, c, d).catch(function hookHandlerFails_ (err) {
      err.method = methodName
      app.emit('error', err)
    })
  }
}

function errorHandler (err) {
  throw err
}
