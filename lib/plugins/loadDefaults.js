/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var loadOptions = require('./loadOptions')

module.exports = function loadDefaults (config) {
  return function loadDefaults_ (app) {
    app.delegate({
      tests: [],
      titles: [],
      stats: {
        pass: 0,
        fail: 0,
        count: 0,
        anonymous: 0
      }
    })
    app.use(loadOptions(config))
    return app
  }
}
