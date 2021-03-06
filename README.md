# gruu-api [![NPM version](https://img.shields.io/npm/v/gruu-api.svg?style=flat)](https://www.npmjs.com/package/gruu-api) [![mit license][license-img]][license-url] [![NPM monthly downloads](https://img.shields.io/npm/dm/gruu-api.svg?style=flat)](https://npmjs.org/package/gruu-api) [![npm total downloads][downloads-img]][downloads-url]

> Core API for Gruu and Mukla - Minimal, modern and extensible test runners

[![code climate][codeclimate-img]][codeclimate-url] 
[![code style][standard-img]][standard-url] 
[![linux build][travis-img]][travis-url] 
[![windows build][appveyor-img]][appveyor-url] 
[![code coverage][coverage-img]][coverage-url] 
[![dependency status][david-img]][david-url]
[![paypal donate][paypalme-img]][paypalme-url] 

You might also be interested in [always-done](https://github.com/hybridables/always-done#readme).

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [API](#api)
  * [Gruu](#gruu)
- [Related](#related)
- [Contributing](#contributing)
- [Building docs](#building-docs)
- [Running tests](#running-tests)
- [Author](#author)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Install
Install with [npm](https://www.npmjs.com/)

```
$ npm install gruu-api --save
```

or install using [yarn](https://yarnpkg.com)

```
$ yarn add gruu-api
```

## Usage
> For more use-cases see the [tests](test.js)

```js
const gruuApi = require('gruu-api')
```

## API

### [Gruu](src/index.js#L111)
> Initialize `Gruu` constructor with optional `options` object. Basically it is just [dush][] which is simple event emitter system and has `.on`, `.off`, `.once`, `.emit` and `.use` methods. In addition the runner adds `.define`, `.delegate`, `.add` and `.run` methods. Use `.add` to define new test and `.run` to start the suite. One more cool thing is that it emit life-cycle events - `start`, `beforeEach`, `pass`, `fail`, `afterEach` and `finish`. So for example if test fail it will emit `fail`, `beforeEach` and `afterEach` events which you can listen with `.on('fail', fn)`. By default `gruu-api` _does not_ comes with included reporter, so you can give listener to each event manually or pass `options.reporter` which is the same thing as plugin - a function that is called immediatelly with `(app)` signature.

_All `options` are also passed to [redolent][] and [each-promise][].
Tests by default are ran concurrently in `opts.settle:true` mode (means that it **won't** stop
after the first found error), so `.run().then()` will be called always._

**Params**

* `options` **{Object}**: see more in [Options Section](#options) _(soon)_    
* `returns` **{Object}**: an object that is returned from `dush`  

**Example**

```js
const delay = require('delay')
const Gruu = require('gruu-api')

const app = Gruu()

// DEFINE TEST SUITE
app.add('my awesome test', (t) => {
  t.strictEqual(111, 111, 'should be 111 === 111')
})

// note: use node >= 7.6
app.add('failing async test', async (t) => {
  await delay(500)
  t.ok(false)
})

app.add('some failing test', (t) => {
  t.strictEqual('foo', 123)
})

// CUSTOM TAP REPORTER, built as plugin
app.use((app) => {
  // makes error object enhanced
  const metadata = require('stacktrace-metadata')

  app.once('start', (app) => {
    console.log('TAP version 13')
  })
  app.on('pass', (app, test) => {
    console.log('# :)', test.title)
    console.log('ok', test.index, '-', test.title)
  })
  app.on('fail', (app, { title, index, reason }) => {
    console.log('# :(', title)
    console.log('not ok', index, '-', title)

    const err = metadata(reason, app.options)
    delete err.generatedMessage

    // TAP-ish YAML-ish output
    let json = JSON.stringify(err, null, 2)
    json = json.replace(/^\{/, '  ---')
    json = json.replace(/\}$/, '  ...')
    console.log(json)

    // or the whole stack
    // console.log(err.stack)
  })
  app.once('finish', ({ stats }) => {
    console.log('')
    console.log(`1..${stats.count}`)
    console.log('# tests', stats.count)
    console.log('# pass ', stats.pass)

    if (stats.fail) {
      console.log('# fail ', stats.fail)
      console.log('')
      process.exit(1)
    } else {
      console.log('')
      console.log('# ok')
      process.exit(0)
    }
  })
})

// START DEFINED TEST SUITE
app.run().then(
  () => console.log('done')
)
```

## Related
- [always-done](https://www.npmjs.com/package/always-done): Handle completion and errors with elegance! Support for streams, callbacks, promises, child processes, async/await and sync functions. A drop-in replacement… [more](https://github.com/hybridables/always-done#readme) | [homepage](https://github.com/hybridables/always-done#readme "Handle completion and errors with elegance! Support for streams, callbacks, promises, child processes, async/await and sync functions. A drop-in replacement for [async-done][] - pass 100% of its tests plus more")
- [minibase](https://www.npmjs.com/package/minibase): Minimalist alternative for Base. Build complex APIs with small units called plugins. Works well with most of the already existing… [more](https://github.com/node-minibase/minibase#readme) | [homepage](https://github.com/node-minibase/minibase#readme "Minimalist alternative for Base. Build complex APIs with small units called plugins. Works well with most of the already existing [base][] plugins.")
- [try-catch-core](https://www.npmjs.com/package/try-catch-core): Low-level package to handle completion and errors of sync or asynchronous functions, using [once][] and [dezalgo][] libs. Useful for and… [more](https://github.com/hybridables/try-catch-core#readme) | [homepage](https://github.com/hybridables/try-catch-core#readme "Low-level package to handle completion and errors of sync or asynchronous functions, using [once][] and [dezalgo][] libs. Useful for and used in higher-level libs such as [always-done][] to handle completion of anything.")

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/gruu-api/issues/new).  
Please read the [contributing guidelines](CONTRIBUTING.md) for advice on opening issues, pull requests, and coding standards.  
If you need some help and can spent some cash, feel free to [contact me at CodeMentor.io](https://www.codementor.io/tunnckocore?utm_source=github&utm_medium=button&utm_term=tunnckocore&utm_campaign=github) too.

**In short:** If you want to contribute to that project, please follow these things

1. Please DO NOT edit [README.md](README.md), [CHANGELOG.md](CHANGELOG.md) and [.verb.md](.verb.md) files. See ["Building docs"](#building-docs) section.
2. Ensure anything is okey by installing the dependencies and run the tests. See ["Running tests"](#running-tests) section.
3. Always use `npm run commit` to commit changes instead of `git commit`, because it is interactive and user-friendly. It uses [commitizen][] behind the scenes, which follows Conventional Changelog idealogy.
4. Do NOT bump the version in package.json. For that we use `npm run release`, which is [standard-version][] and follows Conventional Changelog idealogy.

Thanks a lot! :)

## Building docs
Documentation and that readme is generated using [verb-generate-readme][], which is a [verb][] generator, so you need to install both of them and then run `verb` command like that

```
$ npm install verbose/verb#dev verb-generate-readme --global && verb
```

_Please don't edit the README directly. Any changes to the readme must be made in [.verb.md](.verb.md)._

## Running tests
Clone repository and run the following in that cloned directory

```
$ npm install && npm test
```

## Author
**Charlike Mike Reagent**

+ [github/tunnckoCore](https://github.com/tunnckoCore)
+ [twitter/tunnckoCore](https://twitter.com/tunnckoCore)
+ [codementor/tunnckoCore](https://codementor.io/tunnckoCore)

## License
Copyright © 2016-2017, [Charlike Mike Reagent](https://i.am.charlike.online). Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.3, on March 16, 2017._  
_Project scaffolded using [charlike][] cli._

[always-done]: https://github.com/hybridables/always-done
[async-done]: https://github.com/gulpjs/async-done
[base]: https://github.com/node-base/base
[charlike]: https://github.com/tunnckocore/charlike
[commitizen]: https://github.com/commitizen/cz-cli
[dezalgo]: https://github.com/npm/dezalgo
[dush]: https://github.com/tunnckocore/dush
[each-promise]: https://github.com/tunnckocore/each-promise
[once]: https://github.com/isaacs/once
[redolent]: https://github.com/hybridables/redolent
[standard-version]: https://github.com/conventional-changelog/standard-version
[verb-generate-readme]: https://github.com/verbose/verb-generate-readme
[verb]: https://github.com/verbose/verb

[license-url]: https://www.npmjs.com/package/gruu-api
[license-img]: https://img.shields.io/npm/l/gruu-api.svg

[downloads-url]: https://www.npmjs.com/package/gruu-api
[downloads-img]: https://img.shields.io/npm/dt/gruu-api.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/gruu-api
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/gruu-api.svg

[travis-url]: https://travis-ci.org/tunnckoCore/gruu-api
[travis-img]: https://img.shields.io/travis/tunnckoCore/gruu-api/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/tunnckoCore/gruu-api
[appveyor-img]: https://img.shields.io/appveyor/ci/tunnckoCore/gruu-api/master.svg?label=windows

[coverage-url]: https://codecov.io/gh/tunnckoCore/gruu-api
[coverage-img]: https://img.shields.io/codecov/c/github/tunnckoCore/gruu-api/master.svg

[david-url]: https://david-dm.org/tunnckoCore/gruu-api
[david-img]: https://img.shields.io/david/tunnckoCore/gruu-api.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[paypalme-url]: https://www.paypal.me/tunnckoCore
[paypalme-img]: https://img.shields.io/badge/paypal-donate-brightgreen.svg

