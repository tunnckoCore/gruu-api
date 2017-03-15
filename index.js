/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var dush = require('dush')
var plugin = require('./lib/plugins')

module.exports = function Gruu (options) {
  var app = dush()

  app.use(plugin.loadMainMethods())
  app.use(plugin.loadDefaults(options))
  app.use(plugin.loadListeners())
  app.use(plugin.loadCoreMethods())

  return app
}
