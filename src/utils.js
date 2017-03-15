/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import redolent from 'redolent'
import extendShallow from 'extend-shallow'

const utils = {}

utils.promisify = redolent
utils.extend = extendShallow

utils.define = (obj, prop, val) => Object.defineProperty(obj, prop, {
  configurable: true,
  enumerable: false,
  writable: true,
  value: val
})

export default utils
