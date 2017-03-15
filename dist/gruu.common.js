'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var dush = _interopDefault(require('dush'));
var redolent = _interopDefault(require('redolent'));
var extendShallow = _interopDefault(require('extend-shallow'));
var flow = _interopDefault(require('each-promise'));
var getName = _interopDefault(require('get-fn-name'));
var assert = _interopDefault(require('assert'));

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

var utils = {};

utils.promisify = redolent;
utils.extend = extendShallow;

utils.define = function (obj, prop, val) { return Object.defineProperty(obj, prop, {
  configurable: true,
  enumerable: false,
  writable: true,
  value: val
}); };

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

function mainMethods () {
  return function mainMethods_ (app) {
    app.delegate = function (obj) {
      utils.extend(app, obj);
      return app
    };
    app.define = function (name, val) {
      utils.define(app, name, val);
      return app
    };

    return app
  }
}

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

// var utils = require('../utils.js')

function defaultTapReporter () {
  return function defaultReporter (app) {

  }
}

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

function coreMethods () {
  return function coreMethods_ (app) {
    /**
     * > Add test function.
     *
     * @param {[type]}   title [description]
     * @param {Function} fn    [description]
     * @api public
     */

    app.define('add', function add (title, fn) {
      if (typeof title === 'function') {
        fn = title;
        title = null;
      }
      if (typeof fn !== 'function') {
        var err = new TypeError('.add: expect `fn` to be a function');
        app.emit('error', err);
        return app
      }

      title = typeof title === 'string' ? title : getName(fn);
      if (title === null) {
        app.stats.anonymous++;
      }

      app.stats.count++;
      app.titles.push(title);
      app.tests.push(utils.promisify(fn, app.options));
      return app
    });

    /**
     * > Extends (and clone) `app.options` with given `opts`.
     *
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     * @api public
     */

    app.define('option', function option (opts) {
      app.options = utils.extend({}, app.options, opts);
      return app
    });

    /**
     * > Run test suite. Given `options` are merged
     * with `app.options`, using `app.option` method.
     *
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     * @api public
     */

    app.define('run', function run (options) {
      app.option(options);

      var reporter = typeof app.options.reporter === 'function'
        ? app.options.reporter
        : defaultTapReporter();

      app.use(reporter);

      return utils.promisify(function (done) {
        app.option(defineHooks(app, done));
        flow.each(app.tests, app.options);
      }, app.options)()
    });

    return app
  }
}

/**
 * Utilities / Helpers
 */

var defineHooks = function (app, done) { return ({
  start: function start () {
    app.emit('start', app);
  },

  beforeEach: function beforeEach (item) {
    var test = makeTest(app, item);
    app.emit('beforeEach', app, test);
  },

  afterEach: function afterEach (item) {
    var test = utils.extend(makeTest(app, item), reflect(item));
    app.emit('afterEach', app, test);

    if (test.isRejected) {
      app.stats.fail++;
      app.emit('fail', app, test);
    } else {
      app.stats.pass++;
      app.emit('pass', app, test);
    }

    if (test.isRejected && app.options.settle === false) {
      throw test.reason
    } else {
      return test
    }
  },
  finish: function finish (err, results) {
    app.reason = err;
    app.value = results;

    // merge all from `app` to err if `err` exists
    // so we can use it as `app` but in same time
    // follow the `error-first` style
    utils.extend(err, app);

    if (err) {
      // emit `finish` from the `error` if is need,
      // much better than emitting both events here
      app.emit('error', err);
      done(err, results);
      return
    }
    app.emit('finish', app);
    done(err, results);
  }
}); };

// helper
var makeTest = function (app, item) { return ({
  title: app.titles[item.index],
  index: item.index + 1,
  value: item.value
}); };

// helper
var reflect = function (item) { return (item.reason ? {
  isRejected: true,
  isFulfilled: false,
  reason: item.reason
} : {
  isRejected: false,
  isFulfilled: true,
  value: item.value
}); };

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

function wrapHandlers () {
  return function wrapHookHandlers_ (app) {
    app.delegate({
      on: handlerFactory(app, 'on'),
      off: handlerFactory(app, 'off'),
      once: handlerFactory(app, 'once')
    });

    return app
  }
}

/**
 * Utilities / Helpers
 */

function handlerFactory (app, methodName) {
  return function type_ (name, handler) {
    var fn = name === 'error'
      ? errorHandler
      : nonErrorHandler(app, methodName, handler);

    app[methodName](name, fn);
  }
}

function nonErrorHandler (app, methodName, handler) {
  return function handler_ (a, b, c, d) {
    var fn = utils.promisify(handler, app.options);

    fn(a, b, c, d).catch(function hookHandlerFails_ (err) {
      err.method = methodName;
      app.emit('error', err);
    });
  }
}

function errorHandler (err) {
  throw err
}

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

function loadOptions (config) {
  return function loadOptions_ (app) {
    app.options = utils.extend({
      serial: false,
      settle: true,
      args: assert
    }, config);

    return app
  }
}

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

function loadDefaults (config) {
  return function loadDefaults_ (app) {
    app.use(loadOptions(config));
    app.delegate({
      tests: [],
      titles: [],
      stats: {
        pass: 0,
        fail: 0,
        count: 0,
        anonymous: 0
      }
    });

    return app
  }
}

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

var plugins = {
  mainMethods: mainMethods,
  loadDefaults: loadDefaults,
  wrapHandlers: wrapHandlers,
  coreMethods: coreMethods
};

/*!
 * gruu-api <https://github.com/tunnckoCore/gruu-api>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

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

function Gruu (options) {
  var app = dush();

  app.use(plugins.mainMethods());
  app.use(plugins.loadDefaults(options));
  // app.use(plugin.wrapHandlers())
  app.use(plugins.coreMethods());

  return app
}

module.exports = Gruu;
