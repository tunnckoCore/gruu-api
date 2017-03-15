/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import utils from '../utils.js'
import assert from 'assert'

export default function loadOptions (config) {
  return function loadOptions_ (app) {
    app.options = utils.extend({
      serial: false,
      settle: true,
      args: assert
    }, config)

    return app
  }
}
