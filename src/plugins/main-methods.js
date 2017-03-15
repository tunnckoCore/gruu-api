/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import utils from '../utils.js'

export default function mainMethods () {
  return function mainMethods_ (app) {
    app.delegate = (obj) => {
      utils.extend(app, obj)
      return app
    }
    app.define = (name, val) => {
      utils.define(app, name, val)
      return app
    }

    return app
  }
}
