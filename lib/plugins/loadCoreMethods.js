/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var utils = require('../utils')
var flow = require('each-promise')
var getName = require('get-fn-name')
var reporter = require('./reporter')

module.exports = function loadCoreMethods () {
  return function loadCoreMethods_ (app) {
    /**
     * > Add test function.
     *
     * @param {[type]}   title [description]
     * @param {Function} fn    [description]
     * @api public
     */

    app.define('add', function add (title, fn) {
      if (typeof title === 'function') {
        fn = title
        title = null
      }
      if (typeof fn !== 'function') {
        var err = new TypeError('.add: expect `fn` to be a function')
        app.emit('error', err)
        return app
      }

      title = typeof title === 'string' ? title : getName(fn)
      if (title === null) {
        app.stats.anonymous++
      }

      app.stats.count++
      app.titles.push(title)
      app.tests.push(utils.promisify(fn, app.options))
      return app
    })

    /**
     * > Extends (and clone) `app.options` with given `opts`.
     *
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     * @api public
     */

    app.define('option', function option (opts) {
      app.options = utils.extend({}, app.options, opts)
      return app
    })

    /**
     * > Run test suite. Given `options` are merged
     * with `app.options`, using `app.option` method.
     *
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     * @api public
     */

    app.define('run', function run (options) {
      app.option(options)

      reporter = typeof app.options.reporter === 'function'
        ? app.options.reporter
        : reporter()

      app.use(reporter)

      return utils.promisify(function (done) {
        app.option(defineHooks(app, done))
        flow.each(app.tests, app.options)
      }, app.options)()
    })

    return app
  }
}

/**
 * Utilities / Helpers
 */

function defineHooks (app, done) {
  return {
    start: function start () {
      app.emit('start', app)
    },

    beforeEach: function beforeEach (item) {
      var test = makeTest(app, item)
      app.emit('beforeEach', app, test)
    },

    afterEach: function afterEach (item) {
      var test = utils.extend(makeTest(app, item), reflect(item))
      app.emit('afterEach', app, test)

      if (test.isRejected) {
        app.stats.fail++
        app.emit('fail', app, test)
      } else {
        app.stats.pass++
        app.emit('pass', app, test)
      }

      if (test.isRejected && app.options.settle === false) {
        throw test.reason
      } else {
        return test
      }
    },
    finish: function finish (err, results) {
      app.reason = err
      app.value = results

      // merge all from `app` to err if `err` exists
      // so we can use it as `app` but in same time
      // follow the `error-first` style
      utils.extend(err, app)

      if (err) {
        // emit `finish` from the `error` if is need,
        // much better than emitting both events here
        app.emit('error', err)
        done(err, results)
        return
      }
      app.emit('finish', app)
      done(err, results)
    }
  }
}

// helper
function makeTest (app, item) {
  return {
    title: app.titles[item.index],
    index: item.index + 1,
    value: item.value
  }
}

// helper
function reflect (item) {
  if (item.reason) {
    return {
      isRejected: true,
      isFulfilled: false,
      reason: item.reason
    }
  }

  return {
    isRejected: false,
    isFulfilled: true,
    value: item.value
  }
}
