/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var path = require('path')
var utils = {}

utils.promisify = require('redolent')
utils.extend = require('extend-shallow')

// simplified - MIT: https://github.com/jonschlinkert/export-files
utils.exportFiles = function exportFile (dir) {
  var dirs = fs.readdirSync(dir)
  var len = dirs.length
  var idx = -1
  var plugins = {}

  while (++idx < len) {
    var filepath = path.resolve(dir, dirs[idx])
    var basename = path.basename(filepath)
    var name = utils.pluginName(basename)

    if (name !== 'index') {
      plugins[name] = require(filepath)
    }
  }

  return plugins
}

utils.pluginName = function pluginName (filepath) {
  return filepath.slice(0, filepath.length - 3)
}

utils.define = function define_ (obj, prop, val) {
  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  })
}

module.exports = utils
