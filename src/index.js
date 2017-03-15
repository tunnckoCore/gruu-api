/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import dush from 'dush'
import plugin from './plugins/index.js'

export default function Gruu (options) {
  const app = dush()

  app.use(plugin.mainMethods())
  app.use(plugin.loadDefaults(options))
  app.use(plugin.wrapHandlers())
  app.use(plugin.coreMethods())

  return app
}
