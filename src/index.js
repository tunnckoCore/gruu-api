/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import dush from 'dush'
import plugin from './plugins/index.js'

/**
 * > Initialize `Gruu` constructor with optional `options` object.
 * Basically it is just [dush][] which is simple event emitter system and
 * has `.on`, `.off`, `.once`, `.emit` and `.use` methods. In addition
 * the runner adds `.define`, `.delegate`, `.add` and `.run` methods.
 * Use `.add` to define new test and `.run` to start the suite. One more
 * cool thing is that it emit life-cycle events - `start`, `beforeEach`, `pass`,
 * `fail`, `afterEach` and `finish`. So for example if test fail it
 * will emit `fail`, `beforeEach` and `afterEach` events which you can listen with `.on('fail', fn)`.
 * By default `gruu-api` _does not_ comes with included reporter, so you can
 * give listener to each event manually or pass `options.reporter` which is
 * the same thing as plugin - a function that is called immediatelly with `(app)` signature.
 *
 * _All `options` are also passed to [redolent][] and [each-promise][].
 * Tests by default are ran concurrently in `opts.settle:true` mode (means that it **won't** stop
 * after the first found error), so `.run().then()` will be called always._
 *
 * **Example**
 *
 * ```js
 * const delay = require('delay')
 * const Gruu = require('gruu-api')
 *
 * const app = Gruu()
 *
 * // DEFINE TEST SUITE
 * app.add('my awesome test', (t) => {
 *   t.strictEqual(111, 111, 'should be 111 === 111')
 * })
 *
 * // note: use node >= 7.6
 * app.add('failing async test', async (t) => {
 *   await delay(500)
 *   t.ok(false)
 * })
 *
 * app.add('some failing test', (t) => {
 *   t.strictEqual('foo', 123)
 * })
 *
 * // CUSTOM TAP REPORTER, built as plugin
 * app.use((app) => {
 *   // makes error object enhanced
 *   const metadata = require('stacktrace-metadata')
 *
 *   app.once('start', (app) => {
 *     console.log('TAP version 13')
 *   })
 *   app.on('pass', (app, test) => {
 *     console.log('# :)', test.title)
 *     console.log('ok', test.index, '-', test.title)
 *   })
 *   app.on('fail', (app, { title, index, reason }) => {
 *     console.log('# :(', title)
 *     console.log('not ok', index, '-', title)
 *
 *     const err = metadata(reason)
 *     delete err.generatedMessage
 *
 *     // TAP-ish YAML-ish output
 *     let json = JSON.stringify(err, null, 2)
 *     json = json.replace(/^\{/, '  ---')
 *     json = json.replace(/\}$/, '  ...')
 *     console.log(json)
 *
 *     // or the whole stack
 *     // console.log(err.stack)
 *   })
 *   app.once('finish', ({ stats }) => {
 *     console.log('')
 *     console.log(`1..${stats.count}`)
 *     console.log('# tests', stats.count)
 *     console.log('# pass ', stats.pass)
 *
 *     if (stats.fail) {
 *       console.log('# fail ', stats.fail)
 *       console.log('')
 *       process.exit(1)
 *     } else {
 *       console.log('')
 *       console.log('# ok')
 *       process.exit(0)
 *     }
 *   })
 * })
 *
 * // START DEFINED TEST SUITE
 * app.run().then(
 *   () => console.log('done')
 * )
 * ```
 *
 * @name  Gruu
 * @param {Object} `options` see more in [Options Section](#options) _(soon)_
 * @return {Object} an object that is returned from `dush`
 * @api public
 */

export default function Gruu (options) {
  const app = dush()

  app.use(plugin.mainMethods())
  app.use(plugin.loadDefaults(options))
  // app.use(plugin.wrapHandlers())
  app.use(plugin.coreMethods())

  return app
}
