/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var utils = require('../utils')

module.exports = function loadMainMethods () {
  return function loadMainMethods_ (app) {
    app.delegate = function delegate_ (obj) {
      utils.extend(app, obj)
      return app
    }
    app.define = function define_ (name, val) {
      utils.define(app, name, val)
      return app
    }
    return app
  }
}
