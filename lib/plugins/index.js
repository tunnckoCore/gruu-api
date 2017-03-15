/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import mainMethods from './main-methods.js'
import coreMethods from './core-methods.js'
import wrapHandlers from './wrap-handlers.js'
import loadDefaults from './load-defaults.js'

const plugins = {
  mainMethods,
  loadDefaults,
  wrapHandlers,
  coreMethods
}

/**
 * Expose all files in `plugins/` dir
 * as key/value store, where `key` is the name of the file,
 * and `value` is exported plugin function from that `key` file
 *
 * Like this:
 * {
 *   // lib/plugins/loadMainMethods.js
 *   loadMainMethods: function loadMainMethods () {}
 *
 *   // lib/plugins/loadCoreMethods.js
 *   loadCoreMethods: function loadCoreMethods () {}
 *
 *   // lib/plugins/loadDefaults.js
 *   loadDefaults: function loadDefaults () {}
 * }
 *
 * and etc...
 */

export default plugins
