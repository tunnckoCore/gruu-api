/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import loadOptions from './load-options.js'

export default function loadDefaults (config) {
  return function loadDefaults_ (app) {
    app.use(loadOptions(config))
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

    return app
  }
}
