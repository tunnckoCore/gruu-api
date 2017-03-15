/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('mukla')
var Gruu = require('./dist/gruu.common')
var Bluebird = require('bluebird')

test('gruu-api', function (done) {
  Gruu({ Promise: Bluebird })
  done()
})
